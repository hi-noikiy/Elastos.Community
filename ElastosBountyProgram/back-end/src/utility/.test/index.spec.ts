declare var describe, test, expect, require, process;

import {getEnv, crypto} from '../index';

describe('test utility/index', ()=>{
    test('NODE_ENV should be dev', ()=>{
        expect(getEnv()).toBe('dev');
    });

    test('a', ()=>{
        expect(crypto.sha512('aaa')).toBe('ca6e8b9cc73843c55db941922d68e132fb34274fe3f710df33603e145df499504a5e00569084f6867baf52f2728fcd350004ea4a6d069a2db4a72052689a6918')
    })
});

