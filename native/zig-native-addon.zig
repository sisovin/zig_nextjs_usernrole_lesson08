const std = @import("std");
const builtin = @import("builtin");
const napi = @import("napi");

pub fn init(env: napi.Env, exports: napi.Value) !void {
    try napi.init(env, exports, .{
        .name = "performanceCriticalFunction",
        .function = performanceCriticalFunction,
    });
}

fn performanceCriticalFunction(env: napi.Env, info: napi.CallbackInfo) !napi.Value {
    const args = try napi.getArgs(env, info, 1);
    const input = try napi.getInt32(env, args[0]);

    const result = input * 2; // Example performance-critical operation

    return napi.createInt32(env, result);
}

pub fn NAPI_init(env: napi.Env, exports: napi.Value) !napi.Value {
    try init(env, exports);
    return exports;
}
