// extern crate clap;
// extern crate rand;
// #[macro_use]
// extern crate include_dir;
// extern crate wee_alloc;

pub fn main() {
    println!("Hello, world!");
}

#[no_mangle]
pub fn hello (name: &str) {
    println!("Hello, world! {}", name);
}
