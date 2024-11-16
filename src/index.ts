#!/usr/bin/env node

import { program } from "commander";
import { CardType, userInputSchema } from "./domain/cardDefinition.js";
import { CardEditor } from "./infrastructure/cardEditor.js";
import { ErrorMessage } from "./domain/utils/errorHandler.js";
import { Colors } from "./domain/color.js";
import { Filters } from "./domain/filter.js";

const generate = async (option: Record<string, string|undefined>) => {
    const result = userInputSchema.safeParse(option)

    if(result.error){
        console.table(result.error.issues)
        throw new ErrorMessage('parser', 'The input provided is invalid, please review the table above!')
    }

    const {attacks, cost, name, range, type, image} = result.data

    const cardDefinition = {
        color: Colors[type],
        filter: Filters[type],
        image,
        name,
        cost: cost,
        attack: range as CardType,
        attacks: attacks
    }
    
    const cardEditor = new CardEditor(cardDefinition)
    
    cardEditor.load()
    
    await cardEditor.card.create()
    await cardEditor.card.save()
}

program
    .name('lor-card')
    .description('CLI to generate a Card that looks like from Library of Ruina')
    .version('1.0.0')
    .option('-a, --attacks <char>')
    .option('-c, --cost <char>')
    .option('-i, --image <char>')
    .option('-n, --name <char>')
    .option('-r, --range <char>')
    .option('-t, --type <char>')
    .action(generate)
    .parse()

export {CardEditor} from './infrastructure/cardEditor.js'