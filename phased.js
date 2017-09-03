console.log('NEEDS TO RUN ON LOCAL HOST')

// initiate the game
const game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

// declare globals
let cursors,
    platforms,
    player,
    stars,
    score = 0,
    scoreText;

// load assets
function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

// create game elements
function create() {
    // enable arcade style physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // simple background
    game.add.sprite(0, 0, 'sky');

    //  platforms group contains the ground and the 2 ledges that will be used
    platforms = game.add.group();
    //  enable physics for any object that is created in the group
    platforms.enableBody = true;

    // create the ground.
    let ground = platforms.create(0, game.world.height - 64, 'ground');
    // scale ground to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
    // stops it from moving when you jump on it
    ground.body.immovable = true;

    // create two ledges
    let ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    // player sprite and its settings
    player = game.add.sprite(32, game.world.height - 256, 'dude');
    // enable physics on the player
    game.physics.arcade.enable(player);
    // player physics properties
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 350;
    player.body.collideWorldBounds = true;
    // two animations, walking left and right
    // array tells which sprites to use from spritesheet (declared as spritesheet up top)
    // 10 frames per sec
    // true means to repeat
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    stars = game.add.group();

    stars.enableBody = true;

    // create 12 of them evenly spaced apart
    for (let i = 0; i < 12; i++) {
        // create a star inside of the 'stars' group
        let star = stars.create(i * 70, 0, 'star');
        // let gravity do its thing
        star.body.gravity.y = 50;
        // this just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    // create/enable controls
    cursors = game.input.keyboard.createCursorKeys();

    // score keeper
    // 16, 16 is position
    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });
}

// updates as the game runs
function update() {
    // collide player with the platforms
    let hitPlatform = game.physics.arcade.collide(player, platforms);

    // stars collide as well
    game.physics.arcade.collide(stars, platforms);

    // if the player overlaps with a star
    game.physics.arcade.overlap(player, stars,
        (player, star) => {
            // remove star from view
            star.kill();
            // update score
            score += 10;
            scoreText.text = 'Score: ' + score;
        },
        null, this);

    // reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        //to the left
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        // to the right
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        // still
        player.animations.stop();
        player.frame = 4;
    }

    //  allo to jump if touching the ground
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -350;
    }
}
