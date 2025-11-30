import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  Headers,
  Response,
  URL,
  URLSearchParams,
  fetch,
  createPostgrestFetch,
} from "@/libs/fetch-polyfill";

describe("Headers", () => {
  it("should create empty headers", () => {
    const headers = new Headers();
    expect(headers.get("content-type")).toBeNull();
  });

  it("should create headers from object", () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("authorization")).toBe("Bearer token");
  });

  it("should create headers from array", () => {
    const headers = new Headers([
      ["Content-Type", "application/json"],
      ["Authorization", "Bearer token"],
    ]);
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("authorization")).toBe("Bearer token");
  });

  it("should create headers from another Headers instance", () => {
    const original = new Headers({
      "Content-Type": "application/json",
    });
    const copy = new Headers(original);
    expect(copy.get("content-type")).toBe("application/json");
  });

  it("should be case-insensitive", () => {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("CONTENT-TYPE")).toBe("application/json");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("should append values", () => {
    const headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("accept", "text/plain");
    expect(headers.get("accept")).toBe("application/json, text/plain");
  });

  it("should check if header exists", () => {
    const headers = new Headers({ "Content-Type": "application/json" });
    expect(headers.has("content-type")).toBe(true);
    expect(headers.has("authorization")).toBe(false);
  });

  it("should delete headers", () => {
    const headers = new Headers({ "Content-Type": "application/json" });
    expect(headers.has("content-type")).toBe(true);
    headers.delete("content-type");
    expect(headers.has("content-type")).toBe(false);
  });

  it("should iterate over headers with forEach", () => {
    const headers = new Headers({
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
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    const entries: [string, string][] = [];
    for (const [key, value] of headers) {
      entries.push([key, value]);
    }
    expect(entries).toHaveLength(2);
  });

  it("should provide entries(), keys(), and values() iterators", () => {
    const headers = new Headers({
      "Content-Type": "application/json",
    });
    
    const entries = [...headers.entries()];
    expect(entries).toContainEqual(["content-type", "application/json"]);
    
    const keys = [...headers.keys()];
    expect(keys).toContain("content-type");
    
    const values = [...headers.values()];
    expect(values).toContain("application/json");
  });

  it("should convert to object with toObject()", () => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "Authorization": "Bearer token",
    });
    const obj = headers.toObject();
    expect(obj).toEqual({
      "content-type": "application/json",
      "authorization": "Bearer token",
    });
  });
});

describe("Response", () => {
  it("should create response with default values", () => {
    const response = new Response("test body");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.statusText).toBe("");
    expect(response.bodyUsed).toBe(false);
  });

  it("should create response with custom status", () => {
    const response = new Response("test body", { status: 404 });
    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);
  });

  it("should mark ok as true for 2xx status codes", () => {
    expect(new Response("", { status: 200 }).ok).toBe(true);
    expect(new Response("", { status: 201 }).ok).toBe(true);
    expect(new Response("", { status: 299 }).ok).toBe(true);
  });

  it("should mark ok as false for non-2xx status codes", () => {
    expect(new Response("", { status: 199 }).ok).toBe(false);
    expect(new Response("", { status: 300 }).ok).toBe(false);
    expect(new Response("", { status: 404 }).ok).toBe(false);
    expect(new Response("", { status: 500 }).ok).toBe(false);
  });

  it("should parse JSON body from string", async () => {
    const data = { message: "hello", count: 42 };
    const response = new Response(JSON.stringify(data));
    const result = await response.json();
    expect(result).toEqual(data);
    expect(response.bodyUsed).toBe(true);
  });

  it("should return object as-is for json()", async () => {
    const data = { message: "hello", count: 42 };
    const response = new Response(data);
    const result = await response.json();
    expect(result).toEqual(data);
  });

  it("should get text body", async () => {
    const response = new Response("hello world");
    const result = await response.text();
    expect(result).toBe("hello world");
    expect(response.bodyUsed).toBe(true);
  });

  it("should stringify object for text()", async () => {
    const data = { message: "hello" };
    const response = new Response(data);
    const result = await response.text();
    expect(result).toBe(JSON.stringify(data));
  });

  it("should throw error when body already consumed", async () => {
    const response = new Response("test");
    await response.text();
    await expect(response.json()).rejects.toThrow("Body has already been consumed");
  });

  it("should get arrayBuffer", async () => {
    const response = new Response("hello");
    const buffer = await response.arrayBuffer();
    expect(typeof buffer).toBe("object");
    expect(buffer).toBeTruthy();
    expect(buffer).toHaveProperty("byteLength");
  });

  it("should throw error for blob()", async () => {
    const response = new Response("test");
    await expect(response.blob()).rejects.toThrow("Blob is not supported");
  });

  it("should throw error for formData()", async () => {
    const response = new Response("test");
    await expect(response.formData()).rejects.toThrow("FormData is not supported");
  });

  it("should clone response", () => {
    const response = new Response("test body", {
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
    const response = new Response("test");
    await response.text();
    expect(() => response.clone()).toThrow("Cannot clone a response that has already been consumed");
  });
});

describe("URLSearchParams", () => {
  it("should create empty params", () => {
    const params = new URLSearchParams();
    expect(params.toString()).toBe("");
  });

  it("should parse query string", () => {
    const params = new URLSearchParams("foo=bar&baz=qux");
    expect(params.get("foo")).toBe("bar");
    expect(params.get("baz")).toBe("qux");
  });

  it("should create from object", () => {
    const params = new URLSearchParams({ foo: "bar", baz: "qux" });
    expect(params.get("foo")).toBe("bar");
    expect(params.get("baz")).toBe("qux");
  });

  it("should append values", () => {
    const params = new URLSearchParams();
    params.append("foo", "bar");
    params.append("foo", "baz");
    expect(params.getAll("foo")).toEqual(["bar", "baz"]);
  });

  it("should set values (replacing existing)", () => {
    const params = new URLSearchParams();
    params.append("foo", "bar");
    params.set("foo", "baz");
    expect(params.get("foo")).toBe("baz");
    expect(params.getAll("foo")).toEqual(["baz"]);
  });

  it("should delete values", () => {
    const params = new URLSearchParams("foo=bar&baz=qux");
    params.delete("foo");
    expect(params.has("foo")).toBe(false);
    expect(params.has("baz")).toBe(true);
  });

  it("should check if key exists", () => {
    const params = new URLSearchParams("foo=bar");
    expect(params.has("foo")).toBe(true);
    expect(params.has("baz")).toBe(false);
  });

  it("should serialize to string", () => {
    const params = new URLSearchParams();
    params.append("foo", "bar");
    params.append("baz", "qux");
    expect(params.toString()).toBe("foo=bar&baz=qux");
  });

  it("should encode special characters", () => {
    const params = new URLSearchParams();
    params.set("key", "value with spaces");
    expect(params.toString()).toBe("key=value%20with%20spaces");
  });

  it("should decode special characters from query string", () => {
    const params = new URLSearchParams("key=value%20with%20spaces");
    expect(params.get("key")).toBe("value with spaces");
  });

  it("should provide forEach iteration", () => {
    const params = new URLSearchParams("foo=bar&baz=qux");
    const entries: [string, string][] = [];
    params.forEach((value, key) => {
      entries.push([key, value]);
    });
    expect(entries).toContainEqual(["foo", "bar"]);
    expect(entries).toContainEqual(["baz", "qux"]);
  });

  it("should provide entries(), keys(), and values() iterators", () => {
    const params = new URLSearchParams("foo=bar");
    
    const entries = [...params.entries()];
    expect(entries).toContainEqual(["foo", "bar"]);
    
    const keys = [...params.keys()];
    expect(keys).toContain("foo");
    
    const values = [...params.values()];
    expect(values).toContain("bar");
  });

  it("should handle empty value", () => {
    const params = new URLSearchParams("foo=");
    expect(params.get("foo")).toBe("");
  });

  it("should handle key without equals sign", () => {
    const params = new URLSearchParams("foo");
    expect(params.get("foo")).toBe("");
  });
});

describe("URL", () => {
  it("should parse URL without query string", () => {
    const url = new URL("https://example.com/path");
    expect(url.toString()).toBe("https://example.com/path");
    expect(url.searchParams.toString()).toBe("");
  });

  it("should parse URL with query string", () => {
    const url = new URL("https://example.com/path?foo=bar&baz=qux");
    expect(url.searchParams.get("foo")).toBe("bar");
    expect(url.searchParams.get("baz")).toBe("qux");
  });

  it("should allow modifying search params", () => {
    const url = new URL("https://example.com/path");
    url.searchParams.set("foo", "bar");
    expect(url.toString()).toBe("https://example.com/path?foo=bar");
  });

  it("should append to existing search params", () => {
    const url = new URL("https://example.com/path?existing=value");
    url.searchParams.append("new", "param");
    expect(url.toString()).toContain("existing=value");
    expect(url.toString()).toContain("new=param");
  });

  it("should return URL without query when searchParams is empty", () => {
    const url = new URL("https://example.com/path");
    expect(url.toString()).toBe("https://example.com/path");
  });
});

describe("fetch", () => {
  let mockUniRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUniRequest = uni.request as ReturnType<typeof vi.fn>;
    vi.mocked(uni).request = vi.fn();
  });

  afterEach(() => {
    vi.mocked(uni).request = mockUniRequest;
  });

  it("should make a successful GET request", async () => {
    const mockResponse = {
      data: { message: "success" },
      statusCode: 200,
      header: { "content-type": "application/json" },
    };

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const response = await fetch("https://example.com/api/test");
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

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const body = { name: "test", value: 42 };
    const response = await fetch("https://example.com/api/create", {
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

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    await fetch("https://example.com/api/test", {
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
    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { fail: (err: { errMsg: string }) => void }) => {
      config.fail({ errMsg: "Network error" });
      return { abort: vi.fn() };
    });

    await expect(fetch("https://example.com/api/test")).rejects.toBeInstanceOf(Response);
  });

  it("should handle Headers instance as headers init", async () => {
    const mockResponse = {
      data: {},
      statusCode: 200,
      header: {},
    };

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const headers = new Headers();
    headers.set("Authorization", "Bearer token");
    headers.set("Content-Type", "application/json");

    await fetch("https://example.com/api/test", { headers });

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

describe("createPostgrestFetch", () => {
  let mockUniRequest: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUniRequest = uni.request as ReturnType<typeof vi.fn>;
    vi.mocked(uni).request = vi.fn();
  });

  afterEach(() => {
    vi.mocked(uni).request = mockUniRequest;
  });

  it("should create a fetch function for postgrest-js", async () => {
    const postgrestFetch = createPostgrestFetch();
    
    const mockResponse = {
      data: { id: 1, name: "test" },
      statusCode: 200,
      header: { "content-range": "0-0/1" },
    };

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const response = await postgrestFetch("https://example.com/rest/v1/table", {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-range")).toBe("0-0/1");
    
    const text = await response.text();
    expect(text).toBe(JSON.stringify({ id: 1, name: "test" }));
  });

  it("should handle string response data", async () => {
    const postgrestFetch = createPostgrestFetch();
    
    const mockResponse = {
      data: "plain text response",
      statusCode: 200,
      header: {},
    };

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { success: (res: typeof mockResponse) => void }) => {
      config.success(mockResponse);
      return { abort: vi.fn() };
    });

    const response = await postgrestFetch("https://example.com/rest/v1/table");
    const text = await response.text();
    expect(text).toBe("plain text response");
  });

  it("should handle request failure", async () => {
    const postgrestFetch = createPostgrestFetch();

    (uni.request as ReturnType<typeof vi.fn>).mockImplementation((config: { fail: (err: { errMsg: string }) => void }) => {
      config.fail({ errMsg: "Network request failed" });
      return { abort: vi.fn() };
    });

    await expect(postgrestFetch("https://example.com/rest/v1/table")).rejects.toThrow("Network request failed");
  });
});
