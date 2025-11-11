// 游戏配置
const gameConfig = {
    scenes: [
        {
            image: 'images/foot-bg.jpg',
            sound: 'foot-sound',
            hitArea: { // 脚的区域（相对于图片的百分比）
                top: 40,
                left: 45,
                width: 55,
                height: 60
            }
        },
        {
            image: 'images/butt-bg.jpg',
            sound: 'butt-sound',
            hitArea: { // 屁股的区域（相对于图片的百分比）
                top: 50,
                left: 40,
                width: 60,
                height: 40
            }
        }
    ]
};

// 游戏状态
let currentScene = null;

// DOM元素
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startButton = document.getElementById('start-button');
const gameBackground = document.getElementById('game-background');
const bgMusic = document.getElementById('bg-music');
const footSound = document.getElementById('foot-sound');
const buttSound = document.getElementById('butt-sound');

// 开始播放背景音乐
function startBackgroundMusic() {
    bgMusic.volume = 0.3; // 设置音量为30%
    bgMusic.play().catch(error => {
        console.log('背景音乐播放失败:', error);
        // 如果播放失败（浏览器限制），可以在这里添加用户交互提示
    });
}

// 初始化游戏
function initGame() {
    // 绑定开始按钮事件
    startButton.addEventListener('click', startGame);
    
    // 立即尝试播放背景音乐，但浏览器可能会阻止自动播放
    // 因此添加用户交互事件监听作为备选方案
    startBackgroundMusic();
    
    // 添加用户交互来启动背景音乐（确保在用户第一次交互时播放）
    document.addEventListener('click', startBackgroundMusic, { once: true });
    document.addEventListener('keydown', startBackgroundMusic, { once: true });
}

// 开始游戏
function startGame() {
    // 隐藏开始页面，显示游戏页面
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // 随机选择一个游戏场景
    const randomIndex = Math.floor(Math.random() * gameConfig.scenes.length);
    currentScene = gameConfig.scenes[randomIndex];
    
    // 设置游戏背景
    gameBackground.src = currentScene.image;
    
    // 绑定点击事件
    gameScreen.addEventListener('click', handleClick);
}

// 处理点击事件
function handleClick(event) {
    // 计算点击位置相对于图片的百分比
    const rect = gameBackground.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // 检查是否点击在有效区域内
    const hitArea = currentScene.hitArea;
    if (x >= hitArea.left && x <= hitArea.left + hitArea.width &&
        y >= hitArea.top && y <= hitArea.top + hitArea.height) {
        
        // 播放音效
        const sound = document.getElementById(currentScene.sound);
        sound.currentTime = 0;
        sound.play();
        
        // 创建点击效果
        createSlapEffect(event.clientX, event.clientY);
        
        // 随机选择抖动方向
        const shakeDirection = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        gameBackground.classList.add(`shake-${shakeDirection}`);
        
        // 移除抖动效果
        setTimeout(() => {
            gameBackground.classList.remove(`shake-${shakeDirection}`);
        }, 500);
    }
}

// 创建巴掌效果
function createSlapEffect(x, y) {
    const slap = document.createElement('div');
    slap.className = 'slap-effect';
    slap.style.left = (x - 50) + 'px';
    slap.style.top = (y - 50) + 'px';
    
    gameScreen.appendChild(slap);
    
    // 移除效果元素
    setTimeout(() => {
        slap.remove();
    }, 300);
}

// 启动游戏
window.addEventListener('load', initGame);