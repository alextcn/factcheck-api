import { writeFileSync } from 'fs'
import { AI } from '../src/anthropic'

// init dotenv
require('dotenv').config()
;(async () => {
  console.log(`generating joke...`)
  const ai = new AI()
  const joke = await ai.getJoke()
  console.log(joke)
})()
