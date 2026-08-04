cmake_minimum_required(VERSION 3.20)
project(howso_core)

find_package(ament_cmake REQUIRED)
find_package(backward_ros REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(howso_behavior_tree REQUIRED)
find_package(howso_common REQUIRED)
find_package(howso_costmap_2d REQUIRED)
find_package(howso_util REQUIRED)
find_package(nav_msgs REQUIRED)
find_package(pluginlib REQUIRED)
find_package(rclcpp REQUIRED)
find_package(rclcpp_lifecycle REQUIRED)
find_package(tf2_ros REQUIRED)

howso_package()

add_library(howso_core INTERFACE)
target_include_directories(howso_core
  INTERFACE
    "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>"
    "$<INSTALL_INTERFACE:include/${PROJECT_NAME}>"
)
target_link_libraries(howso_core INTERFACE
  geometry_msgs::geometry_msgs
  howso_behavior_tree::howso_behavior_tree
  howso_costmap_2d::howso_costmap_2d_core
  howso_costmap_2d::howso_costmap_2d_client
  howso_util::howso_util_core
  nav_msgs::nav_msgs
  pluginlib::pluginlib
  rclcpp::rclcpp
  rclcpp_lifecycle::rclcpp_lifecycle
  tf2_ros::tf2_ros
)

install(TARGETS howso_core
  EXPORT howso_core
  ARCHIVE DESTINATION lib
  LIBRARY DESTINATION lib
  RUNTIME DESTINATION bin
)

install(DIRECTORY include/
  DESTINATION include/${PROJECT_NAME}
)

if(BUILD_TESTING)
  find_package(ament_lint_auto REQUIRED)
  # the following line skips the linter which checks for copyrights
  set(ament_cmake_copyright_FOUND TRUE)
  ament_lint_auto_find_test_dependencies()

  find_package(ament_cmake_gtest REQUIRED)

  ament_find_gtest()

  add_subdirectory(test)
endif()

ament_export_include_directories(include/${PROJECT_NAME})
ament_export_dependencies(
  geometry_msgs
  howso_behavior_tree
  howso_costmap_2d
  howso_util
  nav_msgs
  pluginlib
  rclcpp
  rclcpp_lifecycle
  tf2_ros
)
ament_export_targets(howso_core)

ament_package()
