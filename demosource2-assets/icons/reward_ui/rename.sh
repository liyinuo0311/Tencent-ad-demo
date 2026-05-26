#!/bin/bash

cd /Users/liyinuo/Desktop/demosource2.0/icons/reward_ui

# 重命名宝箱
mv icon_1.png chest_open_half.png
mv icon_2.png chest_closed.png
mv icon_3.png chest_open_full.png

# 重命名按钮
mv icon_4.png button_claim.png
mv icon_5.png button_confirm.png

# 重命名带边框的图标
mv icon_6.png framed_bag.png
mv icon_7.png framed_scroll.png
mv icon_8.png framed_jade.png

# 重命名无边框的图标
mv icon_9.png bag.png
mv icon_10.png scroll.png
mv icon_11.png jade.png

echo "所有图标已重命名完成！"
ls -lh
