var text_input; 
var globalVars = new Map();
var integer_list = [];
var float_list = [];
var boolean_list = [];
var string_list = [];


// declaracion multiple ^([\w/!_],?)+:([a-zA-Z])+$
// asignnacion string   ^[\w/!_]+=(['"].*?['"]\+?|[\w/!_]\+?)+$
// asignacion operacion ^[\w/!_]+=[\w/!_\d\+-/*/(/)/^]+$
// expresion aritmetica ^((-\d|\d|[\w!_])+[-+/*])+(-\d|\d|[\w!_])+$

function compile(){
    text_input = document.getElementById('text').value;
    let lines = input_in_lines(text_input);
    for(line of lines){
        line_type(line);
    }
}


//  Take the lines in the input

function input_in_lines(input){
    let newLines = [];
    let lines = input.replace(/\n/g,"");
    lines = lines.split("?");
    if(lines[lines.length-1]===""){
        lines.pop();
    }
    for(line of lines){
        newLines.push(clear_input(line));
    }
    return newLines;
}


// Changes the input lines like we need 

function clear_input(str){
    let chain = str;
    for(let i=0;i<chain.length;i++){
        if(chain[i]==="\""){
            i = findStringEnd(i+1,chain,"\"");
        }
        else if(chain[i]==="'"){
            i = findStringEnd(i+1,chain,"'");
        }
        else if(chain[i]===" "){
            chain = erase_spaces(i,chain);
            i = 0;
        }
    }
    return chain;
}


function findStringEnd(index,chain,letter){
    while(chain[index]!==letter){
        index++
    }
    return index;
}


function erase_spaces(index,chain){
    let first = chain.substr(0,index);
    let count = 0;
    let initial_index = index;
    while(chain[index] === " "){
        index++;
        count++;
    }
    let end = chain.substring(initial_index+count,chain.length)
    return first+end;
}


// Get the operation tyoe of the lines

function line_type(input){
        if(input.match(/^([\w/!_],?)+:([a-zA-Z])+$/)){
            resolve_multi_declaration(input.split(/,|:/));
        }
        else if(input.match(/^[\w/!_]+=[\w/!_\d\+-/*/(/)/^]+$/)){
            resolve_aritmetic_operation(input.split(/=/));
        }
        else if(input.match(/^[\w/!_]+=(['"].*?['"]\+?|[\w/!_]\+?)+$/)){
            resolve_string_operation(input.split(/=/));
        }
        else{
            alert("este codigo que pusiste no sirve mardito marico");
        }
}


function resolve_multi_declaration(input){
    let vars = input;
    let data_type_list = dataType(vars.pop());

    if(data_type_list){
        for(variable of vars){
            if(globalVars.has(variable)){
                error_message("var_exist",variable);
                break;
            }
            if(variable.match(/^(int|float|bool|string)$/)){
                error_message("reserved_name",variable);
                break;
            }
            globalVars.set(variable,null);
            data_type_list.push(variable);
        }
        console.log(globalVars);
        console.log(data_type_list);
    }
    data_type_list = null;
}


function resolve_aritmetic_operation(input){
    let aritmetic_expression = input.pop();
    let variable = input[0];
    if(!globalVars.has(variable)){
        error_message("var_not_declared",variable);
        return;
    }
    while(parenthesisFinder(aritmetic_expression)){
        aritmetic_expression = resolve_parenthesis(aritmetic_expression,parenthesisFinder(aritmetic_expression));
    }
    let solution = resolve_operators(aritmetic_expression);
    if(solution.match(/\d+\.\d+/)){
        if(float_list.includes(variable)){
            solution = parseFloat(solution);
        }
        else{
            solution = parseInt(solution);
        }   
    }
    else{
        solution = parseInt(solution);
    }   
    globalVars.set(variable,solution);
}


function resolve_string_operation(input){

}


function dataType(str){
    switch(str){

        case "int":
            return integer_list;
        break;
        
        case "float":
            return float_list;
        break;

        case "bool":
            return boolean_list;
        break;

        case "string":
            return string_list;
        break;

        default:
            error_message("invalid_data_type",str);
            return false;
        break;
    }
}


function error_message(error_type,error){
    switch(error_type){

        case "var_exist":
            console.log(`The variable:(${error}) is already defined`);
        break;

        case "reserved_name":
            console.log(`The variable:(${error}) has a reserved name`);
        break;

        case "invalid_data_type":
            console.log(`(${error}) is not a valid data type`);
        break;

        case "var_not_declared":
            console.log(`The variable (${error}) doesnt exist`);
        break;

        case "invalid_data_type_asignation":
            console.log(`The variable (${error.var}) is not a (${error.data_type})`);
        break;
    }
}


function parenthesisFinder(expression){
    for(let i = 0;i<expression.length;i++){
        if(expression[i]==="("){
            let x = i+1;
            while(expression[x]!==")"){
                if(expression[x]==="("){
                    i=x;
                }
                x++
            }
            return{exp:expression.substring(i+1,x),position:[i,x+1]};
        }
    }
    return false;
}


function resolve_parenthesis(expression,parenthesis){
    let new_expression = expression;
    let num_resolved = resolve_operators(parenthesis.exp);
    
    new_expression = replaceAt(parenthesis.position[0],parenthesis.position[1],new_expression,num_resolved)
    
    return new_expression;
}


function resolve_operators(input){
    let aritmetic_operation = input;
    aritmetic_operation = replaceVariables(aritmetic_operation);
    aritmetic_operation = replaceMinus(aritmetic_operation);
    let righ;
    let left;
    for(let i = 0;i<aritmetic_operation.length;i++){
        if(aritmetic_operation[i]==="^"){
            righ = take_righ_number(aritmetic_operation,i);
            left = take_left_number(aritmetic_operation,i);
            aritmetic_operation = replaceAt(left.position,righ.position,aritmetic_operation,(Math.pow(left.num,righ.num)).toString());
            i=0;
        }
    }
    for(let i = 0;i<aritmetic_operation.length;i++){
        if(aritmetic_operation[i]==="/"){
            righ = take_righ_number(aritmetic_operation,i);
            left = take_left_number(aritmetic_operation,i);
            aritmetic_operation = replaceAt(left.position,righ.position,aritmetic_operation,(left.num/righ.num).toString());
            i=0;
        }
        else if(aritmetic_operation[i]==="*"){
            righ = take_righ_number(aritmetic_operation,i);
            left = take_left_number(aritmetic_operation,i);
            aritmetic_operation = replaceAt(left.position,righ.position,aritmetic_operation,(left.num*righ.num).toString());
            i=0;
        }
    }
    for(let i = 0;i<aritmetic_operation.length;i++){
        if(aritmetic_operation[i]==="+"){
            righ = take_righ_number(aritmetic_operation,i);
            left = take_left_number(aritmetic_operation,i);
            aritmetic_operation = replaceAt(left.position,righ.position,aritmetic_operation,(left.num+righ.num).toString());
            i=0;
        }
    }
    return aritmetic_operation;
}


function replaceAt(begin,end,str,replaceValue){
    let new_str=str.substring(0,begin) + replaceValue + str.substring(end,str.length);
    return new_str;
}


function replaceVariables(input){
    let aritmetic_operation = input;
    for(let i = 0;i<aritmetic_operation.length;i++){
        if(aritmetic_operation[i].match(/[a-zA-Z!_]/)){
            let x=i+1;
            while(aritmetic_operation[x]!=="+"&&aritmetic_operation[x]!=="-"&&aritmetic_operation[x]!=="*"&&aritmetic_operation[x]!=="/"&&aritmetic_operation[x]!=="^"&&x!==aritmetic_operation.length){
                x++;
            }
            let variable = aritmetic_operation.substring(i,x);
            aritmetic_operation = replaceAt(i,x,aritmetic_operation,globalVars.get(variable).toString());
        }
    }
    return aritmetic_operation;
}


function replaceMinus(input){
    let aritmetic_operation = input;
    for(let i = 0;i<aritmetic_operation.length;i++){
        if(aritmetic_operation[i]==="-"){
            if(aritmetic_operation[i+1]==="-"){
                aritmetic_operation = replaceAt(i,i+2,aritmetic_operation,"+");
            }
            else if(i!==0&&aritmetic_operation[i-1]!=="+"&&aritmetic_operation[i-1]!=="*"&&aritmetic_operation[i-1]!=="/"&&aritmetic_operation[i-1]!=="^"){
                aritmetic_operation = replaceAt(i,i,aritmetic_operation,"+");
            }
        }
    }
    return aritmetic_operation;
}


function take_righ_number(input,index){
    index++
    let begin = index;
    let end;
    while(input[index]!=="+"&&input[index]!=="/"&&input[index]!=="*"&&input[index]!=="^"&&index!==input.length){
        index++
    }
    end = index;
    return {num:parseFloat(input.substring(begin,end)),position:end};
}


function take_left_number(input,index){
    let end = index;
    index--;
    let begin;
    while(input[index-1]!=="+"&&input[index-1]!=="/"&&input[index-1]!=="*"&&input[index-1]!=="^"&&index!==0){
        index--;
    }
    begin = index;
    return {num:parseFloat(input.substring(begin,end)),position:begin};
}