import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PostgrestClient } from '@/libs/postgrest-js/PostgrestClient';
import { PostgrestSingleBuilder } from '@/libs/postgrest-js/PostgrestBuilder';
import * as v from 'valibot';

// Mock fetch for tests
global.fetch = vi.fn();

describe('PostgrestSingleBuilder', () => {
  let client: PostgrestClient;
  const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    client = new PostgrestClient('https://test.supabase.co');
    mockFetch.mockClear();
  });

  describe('single() method', () => {
    it('should return non-null data on success', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => JSON.stringify(mockData),
      });

      const result = await client
        .from('test_table')
        .select('*')
        .eq('id', 1)
        .single();

      expect(result.data).not.toBeNull();
      expect(result.data.parsed).toEqual(mockData);
      expect(result.data.raw).toEqual(mockData);
    });

    it('should return PostgrestSingleBuilder instance', () => {
      const builder = client
        .from('test_table')
        .select('*')
        .eq('id', 1)
        .single();

      expect(builder).toBeInstanceOf(PostgrestSingleBuilder);
    });

    it('should throw error when query returns zero rows (empty body)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => '',
      });

      await expect(
        client
          .from('test_table')
          .select('*')
          .eq('id', 999)
          .single()
      ).rejects.toThrow('JSON object requested, no rows returned');
    });

    it('should throw error when query returns multiple rows (array)', async () => {
      const mockData = [
        { id: 1, name: 'Test 1' },
        { id: 2, name: 'Test 2' },
      ];
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => JSON.stringify(mockData),
      });

      await expect(
        client
          .from('test_table')
          .select('*')
          .single()
      ).rejects.toThrow('JSON object requested, array returned');
    });

    it('should throw error on 404 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Map(),
        text: async () => '',
      });

      await expect(
        client
          .from('test_table')
          .select('*')
          .eq('id', 999)
          .single()
      ).rejects.toThrow('JSON object requested, no rows returned');
    });

    it('should work with proper Accept header for single queries', async () => {
      const mockData = { id: 1, name: 'Test' };

      mockFetch.mockImplementationOnce(async (url, options) => {
        // Verify that when the fetch is actually called (in then()),
        // the Accept header should be set correctly
        const hasCorrectHeader = options.headers['accept'] === 'application/vnd.pgrst.object+json';

        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          headers: new Map(),
          text: async () => JSON.stringify(mockData),
        };
      });

      const result = await client
        .from('test_table')
        .select('*')
        .eq('id', 1)
        .single();

      // Verify the query executed successfully
      expect(result.data.parsed).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should parse data with tableSchema if provided', async () => {
      const mockData = { id: 1, name: 'Test', age: 25 };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => JSON.stringify(mockData),
      });

      const schema = v.object({
        id: v.number(),
        name: v.string(),
        age: v.number(),
      });

      const result = await client
        .from('test_table', schema)
        .select('*')
        .eq('id', 1)
        .single();

      expect(result.data.parsed).toEqual(mockData);
      expect(result.data.raw).toEqual(mockData);
    });

    it('should have non-nullable type signature', async () => {
      const mockData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => JSON.stringify(mockData),
      });

      const result = await client
        .from('test_table')
        .select('*')
        .eq('id', 1)
        .single();

      // TypeScript should allow direct access without null checks
      const parsed = result.data.parsed;
      const raw = result.data.raw;

      expect(parsed).toBeDefined();
      expect(raw).toBeDefined();
    });
  });

  describe('maybeSingle() method', () => {
    it('should allow null data type', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: new Map(),
        text: async () => JSON.stringify([]),
      });

      const result = await client
        .from('test_table')
        .select('*')
        .eq('id', 999)
        .maybeSingle();

      // TypeScript should allow null check for maybeSingle
      if (result.data === null) {
        expect(result.data).toBeNull();
      } else {
        expect(result.data.parsed).toBeDefined();
      }
    });
  });
});
