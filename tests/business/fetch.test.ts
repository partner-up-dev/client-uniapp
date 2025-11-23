import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from "vitest";

// Mock problematic business modules before importing api
vi.mock("@/business/communication/message", () => ({}));
vi.mock("@/business/communication/chat", () => ({}));
vi.mock("@/business/account/base", () => ({
  Account: class Account {
    static async login() {}
  }
}));

import { fetch as apiFetch, FetchHeaders, FetchResponse } from "@/business/api";

describe("FetchHeaders", () => {
  it("should create empty headers", () => {
    const headers = new FetchHeaders();
    expect(headers.get("content-type")).toBeNull();
  });

  it("should create headers from object", () => {
    const headers = new FetchHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("authorization")).toBe("Bearer token");
  });

  it("should create headers from array", () => {
    const headers = new FetchHeaders([
      ["Content-Type", "application/json"],
      ["Authorization", "Bearer token"],
    ]);
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("authorization")).toBe("Bearer token");
  });

  it("should be case-insensitive", () => {
    const headers = new FetchHeaders();
    headers.set("Content-Type", "application/json");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("CONTENT-TYPE")).toBe("application/json");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("should append values", () => {
    const headers = new FetchHeaders();
    headers.append("accept", "application/json");
    headers.append("accept", "text/plain");
    expect(headers.get("accept")).toBe("application/json, text/plain");
  });

  it("should check if header exists", () => {
    const headers = new FetchHeaders({ "Content-Type": "application/json" });
    expect(headers.has("content-type")).toBe(true);
    expect(headers.has("authorization")).toBe(false);
  });

  it("should delete headers", () => {
    const headers = new FetchHeaders({ "Content-Type": "application/json" });
    expect(headers.has("content-type")).toBe(true);
    headers.delete("content-type");
    expect(headers.has("content-type")).toBe(false);
  });

  it("should iterate over headers", () => {
    const headers = new FetchHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    const entries: [string, string][] = [];
    headers.forEach((value, key) => {
      entries.push([key, value]);
    });
    expect(entries).toHaveLength(2);
    expect(entries).toContainEqual(["content-type", "application/json"]);
    expect(entries).toContainEqual(["authorization", "Bearer token"]);
  });

  it("should support for...of iteration", () => {
    const headers = new FetchHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    const entries: [string, string][] = [];
    for (const [key, value] of headers) {
      entries.push([key, value]);
    }
    expect(entries).toHaveLength(2);
  });
});

describe("FetchResponse", () => {
  it("should create response with default values", () => {
    const response = new FetchResponse("test body");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("");
    expect(response.bodyUsed).toBe(false);
  });

  it("should create response with custom status", () => {
    const response = new FetchResponse("test body", { status: 404 });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  it("should mark ok as true for 2xx status codes", () => {
    expect(new FetchResponse("", { status: 200 }).ok).toBe(true);
    expect(new FetchResponse("", { status: 201 }).ok).toBe(true);
    expect(new FetchResponse("", { status: 299 }).ok).toBe(true);
  });

  it("should mark ok as false for non-2xx status codes", () => {
    expect(new FetchResponse("", { status: 199 }).ok).toBe(false);
    expect(new FetchResponse("", { status: 300 }).ok).toBe(false);
    expect(new FetchResponse("", { status: 404 }).ok).toBe(false);
    expect(new FetchResponse("", { status: 500 }).ok).toBe(false);
  });

  it("should parse JSON body", async () => {
    const data = { message: "hello", count: 42 };
    const response = new FetchResponse(JSON.stringify(data));
    const result = await response.json();
    expect(result).toEqual(data);
    expect(response.bodyUsed).toBe(true);
  });

  it("should return object as-is for json()", async () => {
    const data = { message: "hello", count: 42 };
    const response = new FetchResponse(data);
    const result = await response.json();
    expect(result).toEqual(data);
  });

  it("should get text body", async () => {
    const response = new FetchResponse("hello world");
    const result = await response.text();
    expect(result).toBe("hello world");
    expect(response.bodyUsed).toBe(true);
  });

  it("should stringify object for text()", async () => {
    const data = { message: "hello" };
    const response = new FetchResponse(data);
    const result = await response.text();
    expect(result).toBe(JSON.stringify(data));
  });

  it("should throw error when body already consumed", async () => {
    const response = new FetchResponse("test");
    await response.text();
    await expect(response.json()).rejects.toThrow("Body has already been consumed");
  });

  it("should get arrayBuffer", async () => {
    const response = new FetchResponse("hello");
    const buffer = await response.arrayBuffer();
    // Check that the buffer is a valid buffer type
    expect(typeof buffer).toBe("object");
    expect(buffer).toBeTruthy();
    // Should have byteLength property like ArrayBuffer
    expect(buffer).toHaveProperty("byteLength");
  });

  it("should throw error for blob()", async () => {
    const response = new FetchResponse("test");
    await expect(response.blob()).rejects.toThrow("Blob is not supported");
  });

  it("should throw error for formData()", async () => {
    const response = new FetchResponse("test");
    await expect(response.formData()).rejects.toThrow("FormData parsing is not supported");
  });

  it("should clone response", () => {
    const response = new FetchResponse("test body", {
      status: 201,
      statusText: "Created",
      headers: { "Content-Type": "application/json" },
      url: "https://example.com",
    });
    const cloned = response.clone();
    expect(cloned.status).toBe(response.status);
    expect(cloned.statusText).toBe(response.statusText);
    expect(cloned.url).toBe(response.url);
    expect(cloned.headers.get("content-type")).toBe("application/json");
  });

  it("should throw error when cloning consumed response", async () => {
    const response = new FetchResponse("test");
    await response.text();
    expect(() => response.clone()).toThrow("Cannot clone a response that has already been consumed");
  });

  it("should include headers in response", () => {
    const response = new FetchResponse("test", {
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "custom-value",
      },
    });
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(response.headers.get("x-custom-header")).toBe("custom-value");
  });
});

describe("fetch", () => {
  let mockUniRequest: any;

  beforeEach(() => {
    // Save the original mock
    mockUniRequest = uni.request;
    // Create a new mock for our tests
    vi.mocked(uni).request = vi.fn();
  });

  afterEach(() => {
    // Restore the original mock
    vi.mocked(uni).request = mockUniRequest;
  });

  it("should make a successful GET request", async () => {
    const mockResponse = {
      data: { message: "success" },
      statusCode: 200,
      header: { "content-type": "application/json" },
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const response = await apiFetch("https://example.com/api/test");
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data).toEqual({ message: "success" });

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://example.com/api/test",
        method: "GET",
      })
    );
  });

  it("should make a POST request with body", async () => {
    const mockResponse = {
      data: { id: "123" },
      statusCode: 201,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const body = { name: "test", value: 42 };
    const response = await apiFetch("https://example.com/api/create", {
      method: "POST",
      body,
    });

    expect(response.status).toBe(201);
    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "POST",
        data: body,
      })
    );
  });

  it("should include headers in request", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    await apiFetch("https://example.com/api/test", {
      headers: {
        "Authorization": "Bearer token",
        "Content-Type": "application/json",
      },
    });

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: {
          authorization: "Bearer token",
          "content-type": "application/json",
        },
      })
    );
  });

  it("should handle request failure", async () => {
    (uni.request as any).mockImplementation((config: any) => {
      config.fail({ errMsg: "Network error" });
      return { abort: vi.fn() };
    });

    await expect(apiFetch("https://example.com/api/test")).rejects.toBeInstanceOf(FetchResponse);
  });

  it("should handle string body", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    await apiFetch("https://example.com/api/test", {
      method: "POST",
      body: '{"key":"value"}',
    });

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: '{"key":"value"}',
      })
    );
  });

  it("should support URL object as input", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const url = new URL("https://example.com/api/test");
    await apiFetch(url);

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "https://example.com/api/test",
      })
    );
  });

  it("should support URLSearchParams as body", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const params = new URLSearchParams();
    params.append("key1", "value1");
    params.append("key2", "value2");

    await apiFetch("https://example.com/api/test", {
      method: "POST",
      body: params,
    });

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        data: "key1=value1&key2=value2",
      })
    );
  });

  it("should handle FetchHeaders as headers init", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as any).mockImplementation((config: any) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const headers = new FetchHeaders();
    headers.set("Authorization", "Bearer token");
    headers.set("Content-Type", "application/json");

    await apiFetch("https://example.com/api/test", { headers });

    expect(uni.request).toHaveBeenCalledWith(
      expect.objectContaining({
        header: {
          authorization: "Bearer token",
          "content-type": "application/json",
        },
      })
    );
  });
});
