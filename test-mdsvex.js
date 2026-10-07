import { compile } from 'mdsvex';

async function test() {
    const md = `
---
title: Hello
date: 2026-01-01
---
# Hello World
This is a test.
`;
    const result = await compile(md);
    console.log(result);
}

test().catch(console.error);
