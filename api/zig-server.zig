const std = @import("std");
const fs = std.fs;

fn sendFile(conn: std.net.Server.Connection, path: []const u8) !void {
    const allocator = std.heap.page_allocator;

    // Construct full file path
    const full_path = try fs.path.join(allocator, &[_][]const u8{ "public", path });
    defer allocator.free(full_path);

    // Open and read the file
    const file = try fs.cwd().openFile(full_path, .{});
    defer file.close();

    const file_size = try file.getEndPos();
    const contents = try allocator.alloc(u8, file_size);
    defer allocator.free(contents);
    _ = try file.readAll(contents);

    // Determine content type (basic implementation)
    const content_type = if (std.mem.endsWith(u8, path, ".html"))
        "text/html"
    else if (std.mem.endsWith(u8, path, ".css"))
        "text/css"
    else if (std.mem.endsWith(u8, path, ".js"))
        "text/javascript"
    else
        "text/plain";

    // Write HTTP response
    const response_header = try std.fmt.allocPrint(allocator, "HTTP/1.1 200 OK\r\nContent-Type: {s}\r\nContent-Length: {d}\r\nConnection: close\r\n\r\n", .{ content_type, file_size });
    defer allocator.free(response_header);

    try conn.stream.writeAll(response_header);
    try conn.stream.writeAll(contents);
}

fn sendJsonResponse(conn: std.net.Server.Connection, json: []const u8) !void {
    const allocator = std.heap.page_allocator;

    // Write HTTP response
    const response_header = try std.fmt.allocPrint(allocator, "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: {d}\r\nConnection: close\r\n\r\n", .{ json.len });
    defer allocator.free(response_header);

    try conn.stream.writeAll(response_header);
    try conn.stream.writeAll(json);
}

pub fn main() !void {
    // Create address to listen on localhost:3001
    const address = try std.net.Address.parseIp("127.0.0.1", 3001);

    // Initialize server
    var server = try address.listen(.{
        .reuse_address = true,
    });
    defer server.deinit();

    std.debug.print("Server listening on http://127.0.0.1:3001\n", .{});

    while (true) {
        var conn = try server.accept();
        defer conn.stream.close();

        // Read the request
        var buffer: [1024]u8 = undefined;
        const bytes_read = try conn.stream.read(&buffer);
        const request = buffer[0..bytes_read];

        // Parse request path (basic implementation)
        var lines = std.mem.split(u8, request, "\r\n");
        const first_line = lines.first();
        var tokens = std.mem.split(u8, first_line, " ");
        _ = tokens.first(); // HTTP method
        const path = tokens.next() orelse "/";

        if (std.mem.eql(u8, path, "/api/zig-endpoint")) {
            const json_response = "{\"message\": \"Hello from Zig!\"}";
            sendJsonResponse(conn, json_response) catch |err| {
                return err;
            };
        } else {
            // Serve index.html for root path
            const file_path = if (std.mem.eql(u8, path, "/"))
                "index.html"
            else
                path[1..];

            sendFile(conn, file_path) catch |err| {
                if (err == error.FileNotFound) {
                    const not_found =
                        \\HTTP/1.1 404 Not Found
                        \\Content-Type: text/html
                        \\Connection: close
                        \\
                        \\<!DOCTYPE html>
                        \\<html><body><h1>404 Not Found</h1></body></html>
                    ;
                    try conn.stream.writeAll(not_found);
                } else {
                    return err;
                }
            };
        }
    }
}
