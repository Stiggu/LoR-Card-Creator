import sharp from "sharp";
import { MergeParameters, CardDefinition, Image, AttackType } from "./cardDefinition.js";
import { Jimp } from "jimp";
import { ErrorMessage } from "../utils/errorHandler.js";
import { ATTACK } from "../utils/paths.js";


export default class AttackIcon implements Image {
    attacks: AttackType[]
    buffer?: Buffer;
    merge: MergeParameters = {
        x: 220,
        y: 500
    }

    constructor({attacks}: CardDefinition) {
        if(attacks.length > 5)
            throw new ErrorMessage("attacks", "Cards can only have 5 attack skills")

        this.attacks = attacks
        this.merge.x -= (60 * this.attacks.length) / 2
    }

    create = async () => {
        const base = new Jimp({
            width: (70 * this.attacks.length),
            height: 200,
            // color: "green"
        })

        for(const attack of this.attacks) {
            const imagePath = attack.counter ? `counter-${attack.name}.png` : `${attack.name}.png`
            const icon = await sharp(`${ATTACK}/${imagePath}`)
            .resize(80, 80)
            .modulate({
                // lightness: 1000
            })
            .toBuffer()

            const pos = this.attacks.indexOf(attack)
            base.composite(await Jimp.read(icon), (60 * pos), 20)
        }

        base.rotate({
            deg: 6
        })
        this.buffer = await base.getBuffer("image/png")
    }
}