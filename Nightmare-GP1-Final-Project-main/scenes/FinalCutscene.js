export class FinalCutscene extends Phaser.Scene {
    constructor() {
        super("FinalCutscene");
    }

    preload() {
        this.load.video('finalcutscene', 'assets/mp4/finalcutscene - RESIZE.mp4', 'loadeddata', false, true);
        this.load.audio('finalscene_bgm', 'assets/audio/Lonely little music box.wav');
    }

    create() {
        const video = this.add.video(0, 0, 'finalcutscene');
        video.setScale(1.25, 1.25); // adjust the scale to fit the 600x600 screen
        video.x = (this.sys.game.config.width - video.width * 1.5) / 2 + 200; // move 20 pixels to the right
        video.y = (this.sys.game.config.height - video.height * 1.5) / 2 + 200; // move 30 pixels down
        video.play();

        this.finalsceneBgm = this.sound.add('finalscene_bgm', { loop: true });
        this.finalsceneBgm.play();

        video.on('complete', () => {
            this.finalsceneBgm.stop();
            this.scene.start('MainMenu');
        });
    }
}