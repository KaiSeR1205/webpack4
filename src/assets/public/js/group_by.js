function groupby(data,groupItems,childAlias){
    childAlias = childAlias||null
    var obj = {},
    groupId_key = groupItems.join(',')+'_groupId_'+Math.ceil(Math.random()*10)
    return data.reduce(function(c,n){
        var rule = JSON.stringify(groupItems.map(function(o,i){return n[o]}))
        if(obj[rule]){
            c.find(function(o,i){
                if(o[groupId_key] === rule){
                    childAlias?obj[rule][childAlias].push(n):""
                } 
            })
        }else{
            obj[rule] ={}
            obj[rule][groupId_key] = rule
            childAlias?obj[rule][childAlias] = [].concat(n):""
            groupItems.forEach(function(o,i){obj[rule][o] = n[o]})
            c.push(obj[rule])
        }
        return c
    },[]).map(function(o,i){delete o[groupId_key];return o})  
}

function groupby_sum(data,groupItems,childAlias,calculate){
    function getNum(num){
        return Number(isNaN(num)?0:num) 
    }
    var data = groupby(data,groupItems,childAlias)
    
    return data.map(function(o,i){
        calculate.forEach(function(t,idx){
            o[t] = o[childAlias].reduce(function(c,n){
                return c+getNum(n[t])
            },0)
        })
        return o
    })
}

function groupby_count(data,groupItems,childAlias,calculate){
    function getNum(num){
        return Number(isNaN(num)?0:num) 
    }
    var data = groupby(data,groupItems,childAlias)
    
    return data.map(function(o,i){
        o[calculate] = o[childAlias].length
        return o
    })    
}

function groupby_avg(data,groupItems,childAlias,calculate){
    function getNum(num){
        return Number(isNaN(num)?0:num) 
    }
    var data = groupby(data,groupItems,childAlias)
    
    return data.map(function(o,i){
        calculate.forEach(function(t,idx){
            o[t] = o[childAlias].reduce(function(c,n){
                return c+getNum(n[t])
            },0)/o[childAlias].length
        })
        return o
    })     
}


/* 测试
var data = [{"cData":"20200101","TranType":"130","Amt":100,"TranT":"1"},{"cData":"20200101","TranType":"130","Amt":300,"TranT":"1"},{"cData":"20200101","TranType":"105","Amt":300,"TranT":"2"},{"cData":"20200101","TranType":"124","Amt":200,"TranT":"1"},{"cData":"20200102","TranType":"124","Amt":400,"TranT":"1"},{"cData":"20200102","TranType":"124","Amt":1000,"TranT":"1"},{"cData":"20200104","TranType":"130","Amt":2000,"TranT":"1"},{"cData":"20200104","TranType":"130","Amt":100,"TranT":"1"},{"cData":"20200105","TranType":"130","Amt":100,"TranT":"1"},{"cData":"20200116","TranType":"105","Amt":500,"TranT":"2"},{"cData":"20200106","TranType":"106","Amt":100,"TranT":"3"}]

var sum = groupby_sum(data,['cData','TranT'],'childrens',['Amt'])
console.log('sum',sum)

var count = groupby_count(data,['cData','TranT'],'childrens','count')
console.log('count',count)

var avg = groupby_avg(data,['cData','TranT'],'childrens',['Amt'])
console.log('avg',avg) 
*/