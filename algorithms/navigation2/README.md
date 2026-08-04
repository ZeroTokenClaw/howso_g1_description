# 华苏导航算法

华苏导航算法是面向机器人仿真、路径规划和自主导航验证的算法参考模块。本目录基于 ROS Navigation2 选取与仿真平台相关性较高的规划、控制、代价地图和接口包，用于支撑后续的导航算法评估、仿真场景验证和系统集成设计。

该模块重点关注移动机器人从环境建模、全局路径规划、局部轨迹跟踪到避障控制的核心链路，适用于室内配送、巡检、仓储搬运、服务机器人和具身智能仿真等场景。

上游仓库：https://github.com/ros-navigation/navigation2

引入版本：`d8ce922c79559fafb8379069357de121a7a98ae1`

## 模块定位

华苏机器人仿真平台主要面向机器人数据、任务和仿真能力管理。华苏导航算法作为平台中的算法参考目录，提供经典且成熟的 ROS 2 导航算法源码，便于研发人员进行以下工作：

- 对比不同全局规划算法在栅格地图、复杂障碍物和不同机器人运动模型下的路径效果。
- 评估局部控制器在路径跟踪、动态避障、速度约束和轨迹平滑方面的表现。
- 复用代价地图、消息接口和插件接口，设计平台后续的仿真导航能力。
- 为项目汇报、技术选型和二次开发提供可追溯的源码依据。

## 能力范围

- 全局路径规划：支持 A*、Hybrid-A*、State Lattice、Theta*、NavFn/Dijkstra 等规划思路。
- 局部轨迹控制：支持 MPPI 和 Regulated Pure Pursuit 等路径跟踪控制方法。
- 环境建模：支持二维代价地图、障碍物层、膨胀层、过滤器等导航环境表达。
- 插件化接口：保留 Navigation2 的 planner、controller、messages 和 utility 支撑包，方便后续接入 ROS 2 仿真环境。

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
