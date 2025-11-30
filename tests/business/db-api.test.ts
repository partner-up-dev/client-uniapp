import { describe, it, expect, vi, beforeEach } from "vitest";
import { DBApiClient } from "@/business/db-api";
import { PostgrestQueryBuilder, PostgrestFilterBuilder } from "@/libs/postgrest-js";

// Mock the account store
vi.mock("@/store/account", () => ({
  useAccountStore: vi.fn(() => ({
    authHeaders: {
      Authorization: "Bearer test-token",
    },
  })),
}));

// Mock the store
vi.mock("@/store", () => ({
  default: {},
}));

describe("DBApiClient", () => {
  describe("constructor", () => {
    it("should create a DBApiClient instance", () => {
      const client = new DBApiClient({
        tableName: "test_table",
      });
      expect(client).toBeInstanceOf(DBApiClient);
      expect(client).toBeInstanceOf(PostgrestQueryBuilder);
    });

    it("should accept schema option", () => {
      const client = new DBApiClient({
        tableName: "test_table",
        schema: "custom_schema",
      });
      expect(client).toBeInstanceOf(DBApiClient);
    });
  });

  describe("query methods", () => {
    let client: DBApiClient;

    beforeEach(() => {
      client = new DBApiClient({
        tableName: "test_table",
        schema: "test_schema",
      });
    });

    describe("select", () => {
      it("should return a PostgrestFilterBuilder", () => {
        const result = client.select("*");
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should allow chaining with filters", () => {
        const result = client.select("*").eq("id", 1);
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should allow specifying columns", () => {
        const result = client.select("id, name, email");
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should accept options", () => {
        const result = client.select("*", { count: "exact" });
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });
    });

    describe("insert", () => {
      it("should return a PostgrestFilterBuilder", () => {
        const result = client.insert({ name: "test" });
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should accept an array of values", () => {
        const result = client.insert([
          { name: "test1" },
          { name: "test2" },
        ]);
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should accept options", () => {
        const result = client.insert({ name: "test" }, { count: "exact" });
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });
    });

    describe("update", () => {
      it("should return a PostgrestFilterBuilder", () => {
        const result = client.update({ name: "updated" });
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should allow chaining with filters", () => {
        const result = client.update({ name: "updated" }).eq("id", 1);
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });
    });

    describe("delete", () => {
      it("should return a PostgrestFilterBuilder", () => {
        const result = client.delete();
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should allow chaining with filters", () => {
        const result = client.delete().eq("id", 1);
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });
    });

    describe("upsert", () => {
      it("should return a PostgrestFilterBuilder", () => {
        const result = client.upsert({ id: 1, name: "test" });
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should accept an array of values", () => {
        const result = client.upsert([
          { id: 1, name: "test1" },
          { id: 2, name: "test2" },
        ]);
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });

      it("should accept options", () => {
        const result = client.upsert(
          { id: 1, name: "test" },
          { onConflict: "id", ignoreDuplicates: true }
        );
        expect(result).toBeInstanceOf(PostgrestFilterBuilder);
      });
    });
  });

  describe("reusability", () => {
    it("should create fresh query builders for each operation", () => {
      const client = new DBApiClient({
        tableName: "test_table",
      });

      // Call select twice and verify they return different instances
      const result1 = client.select("*");
      const result2 = client.select("id, name");

      // The underlying URL should be different (different select columns)
      expect(result1).not.toBe(result2);
    });

    it("should not share state between operations", () => {
      const client = new DBApiClient({
        tableName: "test_table",
      });

      // First operation with a filter
      const result1 = client.select("*").eq("status", "active");
      
      // Second operation should start fresh
      const result2 = client.select("*");

      // They should be independent instances
      expect(result1).not.toBe(result2);
    });
  });

  describe("type safety", () => {
    interface User {
      id: number;
      name: string;
      email: string;
    }

    it("should support generic type parameter", () => {
      const client = new DBApiClient<User>({
        tableName: "users",
      });

      // TypeScript should recognize the type
      const result = client.select("*");
      expect(result).toBeInstanceOf(PostgrestFilterBuilder);
    });
  });
});
