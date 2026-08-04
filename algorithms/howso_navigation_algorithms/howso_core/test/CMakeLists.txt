# NavigatorMuxer test
howso_add_gtest(test_navigator_muxer test_navigator_muxer.cpp)
target_link_libraries(test_navigator_muxer
  howso_core
)

# BehaviorTreeNavigator test
howso_add_gtest(test_behavior_tree_navigator test_behavior_tree_navigator.cpp)
target_link_libraries(test_behavior_tree_navigator
  howso_core
  howso_msgs::howso_msgs
)
