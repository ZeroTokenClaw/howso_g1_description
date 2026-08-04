# tests for regulated PP
find_package(howso_controller REQUIRED)

howso_add_gtest(test_regulated_pp
  test_regulated_pp.cpp
  test_dwpp_functions.cpp
  path_utils/path_utils.cpp
)
target_link_libraries(test_regulated_pp
  ${library_name}
  geometry_msgs::geometry_msgs
  howso_core::howso_core
  howso_costmap_2d::howso_costmap_2d_core
  howso_util::howso_util_core
  howso_controller::feasible_path_handler
  howso_controller::simple_goal_checker
  nav_msgs::nav_msgs
  rclcpp::rclcpp
  rclcpp_lifecycle::rclcpp_lifecycle
)

# Path utils test
howso_add_gtest(test_path_utils path_utils/test_path_utils.cpp path_utils/path_utils.cpp)
target_link_libraries(test_path_utils
  nav_msgs::nav_msgs
  geometry_msgs::geometry_msgs
  tf2::tf2
  tf2_geometry_msgs::tf2_geometry_msgs
)
