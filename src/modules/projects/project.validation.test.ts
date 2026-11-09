import assert from 'node:assert/strict';
import test from 'node:test';
import { createProjectSchema, updateProjectSchema, projectGallerySchema } from './project.validation';

const design = { source: 'url', url: 'https://example.com/render.jpg', isCover: true };
const site = { source: 'upload', uploadIndex: 0, isCover: false, kind: 'SITE', visitedAt: '2026-11-09', siteStage: 'BEFORE_WORK', areaSqFt: 1250.5, notes: 'Existing site before excavation' };

test('accepts design previews alongside site observations before work starts', () => {
    const result = projectGallerySchema.parse([design, site]);
    assert.equal(result[1].areaSqFt, 1250.5);
    assert.equal(result[1].siteStage, 'BEFORE_WORK');
});
test('older gallery submissions remain compatible', () => {
    assert.equal(projectGallerySchema.safeParse([design]).success, true);
});
test('rejects impossible visit dates and nonpositive measurements', () => {
    for (const fields of [{ visitedAt: '2026-02-30' }, { visitedAt: 'invalid' }, { areaSqFt: -1 }, { areaSqFt: 0 }, { areaSqFt: Infinity }, { siteStage: 'UNKNOWN' }, { kind: 'UNKNOWN' }, { notes: 'x'.repeat(2001) }]) {
        assert.equal(projectGallerySchema.safeParse([design, { ...site, ...fields }]).success, false);
    }
});
test('allows clearing optional visit observations on a retained image', () => {
    assert.equal(projectGallerySchema.safeParse([{ source: 'existing', id: 'c606771c-3aa3-4a73-a310-9dacaa87897b', isCover: true, kind: 'SITE', visitedAt: null, siteStage: null, areaSqFt: null, notes: null }]).success, true);
});
test('retains gallery protections against repeated uploads and missing covers', () => {
    assert.equal(projectGallerySchema.safeParse([design, site, site]).success, false);
    assert.equal(projectGallerySchema.safeParse([site]).success, false);
});
test('supports accumulating site history beyond ten photos', () => {
    const history = Array.from({ length: 20 }, (_, index) => ({ ...design, isCover: index === 0, kind: 'SITE' }));
    assert.equal(projectGallerySchema.safeParse(history).success, true);
});

test('project site area is optional, accepts measurements and can be cleared', () => {
    const project = { name: 'Test project', country: 'Saudi Arabia' };
    assert.equal(createProjectSchema.safeParse(project).success, true);
    assert.equal(createProjectSchema.parse({ ...project, areaSqFt: '1250.50' }).areaSqFt, 1250.5);
    assert.equal(updateProjectSchema.parse({ areaSqFt: 'null' }).areaSqFt, null);
    for (const areaSqFt of [0, -1, 'invalid', 10000000000]) {
        assert.equal(createProjectSchema.safeParse({ ...project, areaSqFt }).success, false);
    }
});
