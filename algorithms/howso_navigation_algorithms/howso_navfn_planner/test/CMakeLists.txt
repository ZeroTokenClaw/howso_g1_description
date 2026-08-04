# Test dynamic parameters
howso_add_gtest(test_dynamic_parameters
  test_dynamic_parameters.cpp
)
target_link_libraries(test_dynamic_parameters
  ${library_name}
  howso_costmap_2d::howso_costmap_2d_core
  howso_util::howso_util_core
  rclcpp::rclcpp
  rclcpp_lifecycle::rclcpp_lifecycle
)
