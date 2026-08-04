// Copyright 2020 Anshumaan Singh
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#ifndef HOWSO_THETA_STAR_PLANNER__THETA_STAR_PLANNER_HPP_
#define HOWSO_THETA_STAR_PLANNER__THETA_STAR_PLANNER_HPP_

#include <iostream>
#include <cmath>
#include <string>
#include <chrono>
#include <queue>
#include <algorithm>
#include <memory>
#include <vector>
#include "rclcpp/rclcpp.hpp"
#include "howso_core/global_planner.hpp"
#include "howso_core/planner_exceptions.hpp"
#include "nav_msgs/msg/path.hpp"
#include "howso_util/robot_utils.hpp"
#include "howso_ros_common/lifecycle_node.hpp"
#include "howso_costmap_2d/costmap_2d_ros.hpp"
#include "howso_costmap_2d/cost_values.hpp"
#include "howso_ros_common/node_utils.hpp"
#include "howso_theta_star_planner/theta_star.hpp"
#include "howso_theta_star_planner/parameter_handler.hpp"
#include "howso_util/geometry_utils.hpp"
#include "howso_ros_common/tf2_factories.hpp"

using rcl_interfaces::msg::ParameterType;

namespace howso_theta_star_planner
{

class ThetaStarPlanner : public howso_core::GlobalPlanner
{
public:
  void configure(
    const howso::LifecycleNode::WeakPtr & parent,
    std::string name, howso::TransformBuffer::SharedPtr tf,
    std::shared_ptr<howso_costmap_2d::Costmap2DROS> costmap_ros) override;

  void cleanup() override;

  void activate() override;

  void deactivate() override;

  /**
   * @brief Creating a plan from start and goal poses
   * @param start Start pose
   * @param goal Goal pose
   * @param cancel_checker Function to check if the action has been canceled
   * @return howso_msgs::Path of the generated path
   */
  nav_msgs::msg::Path createPlan(
    const geometry_msgs::msg::PoseStamped & start,
    const geometry_msgs::msg::PoseStamped & goal,
    const std::vector<geometry_msgs::msg::PoseStamped> & viapoints,
    std::function<bool()> cancel_checker) override;

protected:
  howso::TransformBuffer::SharedPtr tf_;
  rclcpp::Clock::SharedPtr clock_;
  rclcpp::Logger logger_{rclcpp::get_logger("ThetaStarPlanner")};
  std::string global_frame_, name_;

  // parent node weak ptr
  howso::LifecycleNode::WeakPtr parent_node_;

  std::unique_ptr<ThetaStar> planner_;

  Parameters * params_;
  std::unique_ptr<howso_theta_star_planner::ParameterHandler> param_handler_;

  /**
   * @brief the function responsible for calling the algorithm and retrieving a path from it
   * @param cancel_checker is a function to check if the action has been canceled
   * @return global_path is the planned path to be taken
   */
  void getPlan(nav_msgs::msg::Path & global_path, std::function<bool()> cancel_checker);

  /**
   * @brief interpolates points between the consecutive waypoints of the path
   * @param raw_path is used to send in the path received from the planner
   * @param dist_bw_points is used to send in the interpolation_resolution (which has been set as the costmap resolution)
   * @return the final path with waypoints at a distance of the value of interpolation_resolution of each other
   */
  static nav_msgs::msg::Path linearInterpolation(
    const std::vector<coordsW> & raw_path,
    const double & dist_bw_points);
};
}   //  namespace howso_theta_star_planner

#endif  //  HOWSO_THETA_STAR_PLANNER__THETA_STAR_PLANNER_HPP_
