cmake_minimum_required(VERSION 3.16)

project(EU4LandDamageCalculator LANGUAGES CXX)

add_executable(eu4_damage_calculator WIN32 main.cpp)
target_compile_features(eu4_damage_calculator PRIVATE cxx_std_17)
target_compile_definitions(eu4_damage_calculator PRIVATE UNICODE _UNICODE)

if(MINGW)
    target_compile_options(eu4_damage_calculator PRIVATE -finput-charset=UTF-8)
    target_link_options(eu4_damage_calculator PRIVATE -municode)
endif()
