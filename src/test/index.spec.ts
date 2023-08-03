import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import * as index from '../index'

const expectedUtils = fs
  .readdirSync(path.join(__dirname, '..'))
  .filter((f) => f !== 'index.js' && path.extname(f) === '.js')
  .map((f) => path.basename(f, path.extname(f)))
  .map((f) => f.replace(/-(.)/g, (m0, m1) => m1.toUpperCase()))

describe('relign', () => {
  it('exports all of the utils', () => {
    const actualUtils = Object.keys(index)
    for (const expectedUtil of expectedUtils) {
      expect(actualUtils.indexOf(expectedUtil)).not.toBe(-1)
    }
  })
})
