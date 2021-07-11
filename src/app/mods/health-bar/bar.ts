export class Bar {

    private fighter: any;
    private wGame: any;

    private lifeBarContainer : HTMLDivElement;
    private lifeBar : HTMLDivElement;
    private lifePointsText : HTMLDivElement;

    constructor(fighter: any, wGame: any | Window){
        this.fighter = fighter;
        this.wGame = wGame;

        this.create();
    }

    public update(visibleText:boolean){
        const fighter = this.wGame.gui.fightManager.getFighter(this.fighter.id);

        if (this.wGame.gui.fightManager.isInBattle()) {
            if (fighter.data.alive) {
                if (!this.lifeBar || !this.lifeBarContainer || !this.lifePointsText) this.create();
                
                    const lifemaxPercentage = (fighter.data.stats.lifePoints * 100) / (fighter.data.stats.maxLifePoints + fighter.data.stats.shieldPoints);
                    const shieldMaxPercentage = lifemaxPercentage + ((fighter.data.stats.shieldPoints * 100) / (fighter.data.stats.maxLifePoints + fighter.data.stats.shieldPoints));
                    const teamColor = this.fighter.data.teamId === 0 ? 'red' : '#3ad';
                    
                    this.lifeBar.style.background = 'linear-gradient(to right, ' + teamColor + ' 0%,' + teamColor + ' ' + lifemaxPercentage + '%,#944ae0 ' + lifemaxPercentage + '%,#944ae0 ' + shieldMaxPercentage + '%,#222 ' + shieldMaxPercentage + '%,#222 100%)';
                    this.lifePointsText.innerHTML = visibleText ? fighter.data.stats.lifePoints + fighter.data.stats.shieldPoints : "";

                    const invisible = fighter.buffs.some(({ effect: { effectId } }) => effectId === 150);
                    const cellId = fighter.data.disposition.cellId;

                    if (cellId && (!invisible || this.wGame.gui.fightManager.isFighterOnUsersTeam(fighter.id))) {
                        try {
                            const scenePos = this.wGame.isoEngine.mapRenderer.getCellSceneCoordinate(cellId);
                            const pos = this.wGame.isoEngine.mapScene.convertSceneToCanvasCoordinate(scenePos.x, scenePos.y);
                            this.lifeBarContainer.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
                            this.lifeBarContainer.style.top = (pos.y) + 'px';
                            this.lifePointsText.style.left = (pos.x - this.lifeBarContainer.offsetWidth / 2) + 'px';
                            this.lifePointsText.style.top = (pos.y) + 'px';
                        }
                        catch(e) {
                            Logger.error(cellId);
                            Logger.error(e);
                        }
                    }
                    else if (invisible) {
                        this.lifeBarContainer.style.opacity = '0.5';
                        this.lifePointsText.style.opacity = '0.5';
                }
            }
        }
    }

    private create(){

        /* lifeBarContainer */
        this.lifeBarContainer = document.createElement('div');
        this.lifeBarContainer.id = 'fighterLifeBarContainer' + this.fighter.id;
        this.lifeBarContainer.className = 'lifeBarContainer';

        /* lifeBar */
        this.lifeBar = document.createElement('div');
        this.lifeBar.id = 'fighterLifeBar' + this.fighter.id;
        this.lifeBar.className = 'lifeBar';
        this.lifeBarContainer.appendChild(this.lifeBar);

        /* lifePointsText */
        this.lifePointsText = document.createElement('div');
        this.lifePointsText.id = 'fighterLifePoints' + this.fighter.id;
        this.lifePointsText.className = 'lifePointsText';

        this.wGame.document.getElementById('lifeBars').appendChild(this.lifeBarContainer);
        this.wGame.document.getElementById('lifeBars').appendChild(this.lifePointsText);
    }

    public destroy(){
        this.lifePointsText.parentElement.removeChild(this.lifePointsText);
        this.lifeBar.parentElement.removeChild(this.lifeBar);
        this.lifeBarContainer.parentElement.removeChild(this.lifeBarContainer);
    }
}
