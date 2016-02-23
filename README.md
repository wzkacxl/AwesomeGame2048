基于Sass、原生JS写的2048小游戏。
====================

采用MVC思想，
数据请求、数据操作（M）放在game_manager.js中
---------------------
视图的操作和改变放在（V）放在html_actuator.js中
---------------------
事件的监听、绑定（C）放在inputManager.js中
---------------------

使用了CSS3的2D转换、过渡、动画等，应用在每个数字块（tile）出现、移动、合并等动作上。
---------------------
使用了localStorage保存上次游戏进度，每次载入页面时，载入前回的进度。
---------------------
截图：
---------------------
![image](https://github.com/wzkacxl/AwesomeGame2048/blob/master/image/screenshutshot1.png)
![image](https://github.com/wzkacxl/AwesomeGame2048/blob/master/image/screenshutshot2.png)
