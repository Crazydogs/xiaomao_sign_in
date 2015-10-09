"use strict";

var fs = require('fs');
var colors = require('colors');

fs.readFile('./data.txt', 'utf8', function (err, data) {
    if (!err) {
        var dataGroup = splitData(data);
        if (!process.argv[2]) {
            showTable(dataGroup);
            return;
        }
        switch (process.argv[2]) {
            case 'add':
                addData(dataGroup, data.length);
                break;
        }
    }
});

function splitData(data) {
    var list = data.split(/[\r\n]/).slice(0, -1);
    var group = [];
    for (let i = 0; i < list.length; i++) {
        let line = list[i];
        let type = 'date';
        if (line.indexOf('date') === -1) {
            type = 'data';
        }

        if (type === 'date') {
            group.push({
                date: line.slice(5).split('.'),
                data: []
            });
        } else {
            group[group.length - 1].data.push(line);
        }
    }
    return group;
}

function showTable(dataGroup) {
    for (let i = 0; i < dataGroup.length; i++) {
        let data = dataGroup[i];
        console.log('连击开始（— —）/');
        console.log('起始时间', data.date.join('.'));
        for (let j = 0; j < data.data.length; j++) {
            showLine(data.data[j], j)
        }

        console.log('\r');
    }
}

function showLine(str, index) {
    var line = '';
    for (let i = 0; i < str.length; i++) {
        line += str[i] == 1 ? 'O'.green : 'X'.red;
    }
    if (str.length >= 7) {
        line += '  奖金：' + (index + 1) + '00元';
    }
    console.log(line);
}

function addData(dataGroup, position) {
    let currentTime = new Date();
    let str = 'date:';
    str += currentTime.getFullYear() + '.';
    str += currentTime.getMonth() + 1 + '.';
    str += currentTime.getDate() + '\n' + '1';
    if (!dataGroup.length) {
        fs.writeFile('./data.txt', str, function () {
            console.log('签到成功'.green);
        });
        return;
    }
    
    if (isFail(getLast(dataGroup))) {
        fs.writeFile('./data.txt', str, position, function () {
            console.log('签到成功'.green);
        });
        return;
    }
    if (isDone(getLast(dataGroup))) {
    }
}

function isFail(lastGroup) {
    let currentTime = new Date();
    let startTime = new Date(lastGroup.date[0], lastGroup.date[1], lastGroup.date[2]);
    let passDay = Math.floor((currentTime.getTime() - startTime.getTime()) / (1000 * 3600 * 24));

    let dayNum = lastGroup.data.join('').length;
    if (passDay > dayNum + 1) {
        if (getLast(lastGroup.data).indexOf('X') !== -1) {
            return true;
        }
    }
    
    return false;
}

function isDone(lastGroup) {
}

function getLast(arrayLike) {
    return arrayLike[arrayLike.length-1];
}
