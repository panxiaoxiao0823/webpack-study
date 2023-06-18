import {a, b} from '../../common/common';

export function helloword() {
    let arr1 = ['1', '2'];
    let arr2 = ['3', '4'];
    let arrConcat = [...arr1, ...arr2];
    console.log('arrConcat==>', arrConcat)
    return 'hello world 007' + '\n' + a() + '\n';
}