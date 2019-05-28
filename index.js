var text_input; 

// declaracion multiple ^([\w/!_],?)+:(int|float|bool|string)$
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
        if(input.match(/^([\w/!_],?)+:(int|float|bool|string)$/)){
            resolve_multi_declaration(input);
        }
        else if(input.match(/^[\w/!_]+=[\w/!_\d\+-/*/(/)/^]+$/)){
            resolve_aritmetic_operation(input);
        }
        else if(input.match(/^[\w/!_]+=(['"].*?['"]\+?|[\w/!_]\+?)+$/)){
            resolve_string_operation(input);
        }
        else{
            alert("este codigo que pusiste no sirve mardito marico");
        }
}


function resolve_multi_declaration(input){
  

}


function resolve_aritmetic_operation(input){

}


function resolve_string_operation(input){

}