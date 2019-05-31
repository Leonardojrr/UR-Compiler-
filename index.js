var text_input; 
var globalVars = new Map();
var integer_list = [];
var float_list = [];
var boolean_list = [];
var string_list = [];


// declaracion multiple ^([\w/!_],?)+:([a-zA-Z])+$
// asignnacion string   ^[\w/!_]+=(['"].*?['"]\+?|[\w/!_]\+?)+$
// asignacion operacion ^[\w/!_]+=[\w/!_\d\+-/*/(/)/^]+$


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
    let variable = input;
    parenthesisFinder(aritmetic_expression);
    
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
    }
}


function parenthesisFinder(expression){

    let ParenthesisFinded = []

    for(let i = 0 ;i<expression.length;i++){
        if(expression[i]==="("){
            let x = i+1;
            while(expression[x]!==")"){
                if(expression[x]==="("){
                    i=x;
                }
                x++
            }
            console.log(expression.substring(i+1,x))
        }
    }


    return ParenthesisFinded;
}