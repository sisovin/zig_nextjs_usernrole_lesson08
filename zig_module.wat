(module
  (type $t0 (func (param i32) (result i32)))
  (func $add_one (export "add_one") (type $t0) (param $p0 i32) (result i32)
    local.get $p0
    i32.const 1
    i32.add)
  (memory $memory (export "memory") 1)
  (data (i32.const 0) "Hello, Zig WASM!"))