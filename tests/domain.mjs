import assert from 'node:assert/strict';
import { elementPieces, elementDefinitions, levelDefinitions, universes, journeyDays, seeds, sampleCodes } from '../public/js/content.js';
assert.equal(elementDefinitions.length,5);
assert.equal(elementPieces.length,165);
assert.equal(universes.length,9);
assert.deepEqual(universes.map(u=>u.slug),['sod','seeds','habits','library','dreams','elements33','identity','observatory','forge']);
assert.equal(journeyDays.length,14);
assert.ok(seeds.length>=12);
for(const seed of seeds){
  assert.ok(seed.id.startsWith('seed-'));
  assert.ok(['latent','discovered'].includes(seed.state));
}
for(const code of sampleCodes){
  assert.ok(code.id.startsWith('SOD-'));
  assert.ok(Array.isArray(code.linkedSeedIds));
  assert.equal('seedGenerated' in code,false);
}
for(const element of elementDefinitions){
  const pieces=elementPieces.filter(piece=>piece.element===element.key);
  assert.equal(pieces.length,33,`${element.name} must have 33 pieces`);
  for(const level of levelDefinitions) assert.equal(pieces.filter(piece=>piece.level===level.key).length,level.quantity);
}
assert.equal(new Set(elementPieces.map(piece=>piece.id)).size,165);
console.log('Domain tests passed: 5 elements, 165 pieces, 9 universes, 14-day Journey, Semilla/Código separation');
