// Study: This file is about construction jobs, their site details, and their photos. Checks examples automatically to see whether the rules behave as expected.
// Study: Bring in `assert` from `'node:assert/strict'` so this file can use it.
import assert from 'node:assert/strict';
// Study: Bring in `test` from `'node:test'` so this file can use it.
import test from 'node:test';
// Study: Bring in `{ createProjectSchema, updateProjectSchema, projectGallerySchema }` from `'./project.validation'` so this file can use it.
import { createProjectSchema, updateProjectSchema, projectGallerySchema } from './project.validation';

// Study: Build the object `design` with the entries below.
const design = { source: 'url', url: 'https://example.com/render.jpg', isCover: true };
// Study: Build the object `site` with the entries below.
const site = { source: 'upload', uploadIndex: 0, isCover: false, kind: 'SITE', visitedAt: '2026-11-09', siteStage: 'BEFORE_WORK', areaSqFt: 1250.5, notes: 'Existing site before excavation' };

// Study: Call `test`.
test('accepts design previews alongside site observations before work starts', () => {
    // Study: Check `[design, site]` using the rule `projectGallerySchema` and obtain the parsed value and store the result as `result`.
    const result = projectGallerySchema.parse([design, site]);
    // Study: Call `assert.equal`.
    assert.equal(result[1].areaSqFt, 1250.5);
    // Study: Call `assert.equal`.
    assert.equal(result[1].siteStage, 'BEFORE_WORK');
// Study: End this group of steps.
});
// Study: Call `test`.
test('older gallery submissions remain compatible', () => {
    // Study: Call `assert.equal`.
    assert.equal(projectGallerySchema.safeParse([design]).success, true);
// Study: End this group of steps.
});
// Study: Call `test`.
test('rejects impossible visit dates and nonpositive measurements', () => {
    // Study: Iterate over each item from `[{ visitedAt: '2026-02-30' }, { visitedAt: 'invalid' }, { areaSqFt: -1 }, { areaSqF…` using `const fields`.
    for (const fields of [{ visitedAt: '2026-02-30' }, { visitedAt: 'invalid' }, { areaSqFt: -1 }, { areaSqFt: 0 }, { areaSqFt: Infinity }, { siteStage: 'UNKNOWN' }, { kind: 'UNKNOWN' }, { notes: 'x'.repeat(2001) }]) {
        // Study: Call `assert.equal`.
        assert.equal(projectGallerySchema.safeParse([design, { ...site, ...fields }]).success, false);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
});
// Study: Call `test`.
test('allows clearing optional visit observations on a retained image', () => {
    // Study: Call `assert.equal`.
    assert.equal(projectGallerySchema.safeParse([{ source: 'existing', id: 'c606771c-3aa3-4a73-a310-9dacaa87897b', isCover: true, kind: 'SITE', visitedAt: null, siteStage: null, areaSqFt: null, notes: null }]).success, true);
// Study: End this group of steps.
});
// Study: Call `test`.
test('retains gallery protections against repeated uploads and missing covers', () => {
    // Study: Call `assert.equal`.
    assert.equal(projectGallerySchema.safeParse([design, site, site]).success, false);
    // Study: Call `assert.equal`.
    assert.equal(projectGallerySchema.safeParse([site]).success, false);
// Study: End this group of steps.
});
// Study: Call `test`.
test('supports accumulating site history beyond ten photos', () => {
    // Study: Call `Array.from` and store the result as `history`.
    const history = Array.from({ length: 20 }, (_, index) => ({ ...design, isCover: index === 0, kind: 'SITE' }));
    // Study: Call `assert.equal`.
    assert.equal(projectGallerySchema.safeParse(history).success, true);
// Study: End this group of steps.
});

// Study: Call `test`.
test('project site area is optional, accepts measurements and can be cleared', () => {
    // Study: Build the object `project` with the entries below.
    const project = { name: 'Test project', country: 'Saudi Arabia' };
    // Study: Call `assert.equal`.
    assert.equal(createProjectSchema.safeParse(project).success, true);
    // Study: Call `assert.equal`.
    assert.equal(createProjectSchema.parse({ ...project, areaSqFt: '1250.50' }).areaSqFt, 1250.5);
    // Study: Call `assert.equal`.
    assert.equal(updateProjectSchema.parse({ areaSqFt: 'null' }).areaSqFt, null);
    // Study: Iterate over each item from `[0, -1, 'invalid', 10000000000]` using `const areaSqFt`.
    for (const areaSqFt of [0, -1, 'invalid', 10000000000]) {
        // Study: Call `assert.equal`.
        assert.equal(createProjectSchema.safeParse({ ...project, areaSqFt }).success, false);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
});
