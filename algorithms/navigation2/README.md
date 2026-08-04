# Navigation2 精选导航算法

本目录收录 ROS Navigation2 中与机器人仿真平台相关性较高的导航算法与支撑接口，用于算法参考、方案说明和后续仿真集成评估。

上游仓库：https://github.com/ros-navigation/navigation2

引入版本：`d8ce922c79559fafb8379069357de121a7a98ae1`

## 精选内容

| 目录 | 作用 |
| --- | --- |
| `nav2_smac_planner` | 全局路径规划，包含 2D A*、Hybrid-A*、State Lattice 等规划器，适合差速、全向、Ackermann 等机器人模型。 |
| `nav2_theta_star_planner` | Theta* 任意角路径规划，适合栅格地图中生成更直接、更平滑的路径。 |
| `nav2_navfn_planner` | 经典 NavFn/Dijkstra 全局规划器，可作为基础规划算法参考。 |
| `nav2_mppi_controller` | MPPI 模型预测路径积分控制器，用于局部轨迹生成、路径跟踪和动态避障。 |
| `nav2_regulated_pure_pursuit_controller` | Regulated Pure Pursuit 路径跟踪控制器，适合移动机器人低复杂度轨迹跟随。 |
| `nav2_costmap_2d` | 二维代价地图，提供障碍物、膨胀层、过滤器等导航环境建模能力。 |
| `nav2_core` | Navigation2 规划器、控制器等插件接口定义。 |
| `nav2_util` | Navigation2 通用工具函数和生命周期节点辅助能力。 |
| `nav2_msgs` | Navigation2 相关消息、服务和动作定义。 |

## 使用说明

这些代码来自 Navigation2 上游仓库的精选包，不是一个可独立编译的完整 ROS 2 workspace。若要在仿真系统中直接编译运行，还需要按 ROS 2 / Navigation2 的依赖关系补齐构建环境。

本目录保留上游源码结构，便于后续按需接入路径规划、局部控制、代价地图或仿真评估模块。

## 许可证

Navigation2 根许可证说明见 `UPSTREAM_LICENSE`，各包的具体许可证以对应目录中的 `package.xml` 为准。本次引入的包包含 Apache-2.0、BSD-3-Clause、MIT 等许可证。
