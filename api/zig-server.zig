const std = @import("std");

pub fn main() !void {
    const allocator = std.heap.page_allocator;
    var server = try std.http.Server.init(allocator, .{
        .handler = handleRequest,
    });
    defer server.deinit();

    const address = try std.net.Address.parseIp4("0.0.0.0", 8080);
    try server.listen(address);
    try server.accept();
}

fn handleRequest(req: std.http.Request, res: std.http.Response) void {
    if (req.method == .get and req.path == "/api/zig-endpoint") {
        res.writeAll("HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"message\": \"Hello from Zig!\"}");
    } else {
        res.writeAll("HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nNot Found");
    }
}
