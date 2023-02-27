//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Main.js                                                       //
//  Project   : game_of_life                                                  //
//  Date      : Jun 17, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2020, 2023                                          //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/gif.js/gif.js",

    "/modules/demolib/source/demolib.js",
];

const TIME_TO_UPDATE    = 0.10;
const CELL_SIZE_DEFAULT = 10;
const CLEAR_COLOR       = "black";

const COLOR_CHANGE_MULTIPLIER = 0.1;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let CurrentTime    = 0;
let NextUpdateTime = 0;

let CellSize  = CELL_SIZE_DEFAULT;
let CurrState = null;
let NextState = null;

let FieldCols = 0;
let FieldRows = 0;

let AllowWrap = true;

//------------------------------------------------------------------------------
let mouse_is_down = false;
let mouse_last_x  = -1;
let mouse_last_y  = -1;
let mouse_moved   = false;


//----------------------------------------------------------------------------//
// Game Implementation                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
CreateGame(cell_size)
{
    CellSize = cell_size;

    FieldRows = to_int(get_canvas_height() / CellSize);
    FieldCols = to_int(get_canvas_width()  / CellSize);

    console.log(FieldRows, FieldCols);

    CurrState = create_2d_array(FieldRows, FieldCols, null);
    NextState = create_2d_array(FieldRows, FieldCols, null);

    for(let i = 0; i < FieldCols * FieldRows / 2; ++i) {
        const y = random_int(0, FieldRows);
        const x = random_int(0, FieldCols);

        CurrState[y][x] = true;
    }
}

//------------------------------------------------------------------------------
function
CountNeighbours(state, y, x)
{
    let count = 0;
    for(let i = y-1; i <= y+1; ++i) {
        const i_out_of_bounds = (i < 0 || i >= state.length);
        if(i_out_of_bounds && !AllowWrap) {
            continue;
        }

        const ii = wrap_around(i, 0, state.length-1);
        for(let j = x-1; j <= x+1; ++j) {
            const j_out_of_bounds = (j < 0 || j >= state[ii].length);
            if(j_out_of_bounds && !AllowWrap) {
                continue;
            }

            if(i == y && j == x) {
                continue;
            }

            const jj = wrap_around(j, 0, state[ii].length-1);
            if(state[ii][jj]) {
                ++count;
            }
        }
    }

    return count;
}

//------------------------------------------------------------------------------
function
ApplyRules()
{
    // 1 - Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // 2 - Any live cell with two or three live neighbours lives on to the next generation.
    // 3 - Any live cell with more than three live neighbours dies, as if by overpopulation.
    // 4 - Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    NextState = create_2d_array(FieldRows, FieldCols, null);

    const rows = CurrState.length;
    const cols = CurrState[0].length;
    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            const is_alive   = CurrState[i][j];
            const neighbours = CountNeighbours(CurrState, i, j);

            if(is_alive) {
                // 1
                if(neighbours < 2) {
                    NextState[i][j] = false;
                }
                // 2
                else if(neighbours == 2 || neighbours == 3) {
                    NextState[i][j] = true;
                }
                // 3
                else {
                    NextState[i][j] = false;
                }
            } else {
                // 4
                if(neighbours == 3) {
                    NextState[i][j] = true;
                }
            }
        }
    }

    CurrState = NextState;
}

//------------------------------------------------------------------------------
function
DrawCurrState()
{
    clear_canvas(CLEAR_COLOR)

    //
    const v = Math.abs(Math.sin(get_total_time() * COLOR_CHANGE_MULTIPLIER));
    set_canvas_fill(chroma.hsl(360 * v, 0.5, 0.5));

    const rows = CurrState.length;
    const cols = CurrState[0].length;

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            const is_alive = CurrState[i][j];
            if(!is_alive) {
                continue;
            }

            fill_rect(
                j * CellSize,
                i * CellSize,
                CellSize - 1,
                CellSize - 1
            );
        }
    }
}


//----------------------------------------------------------------------------//
// Input Handling                                                             //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
OnMouseDown()
{
    mouse_is_down = true;
    mouse_moved   = false;
}

//------------------------------------------------------------------------------
function
OnMouseUp()
{
    mouse_is_down = false;
    mouse_last_x  = -1;
    mouse_last_y  = -1;
}

//------------------------------------------------------------------------------
function
OnMouseMove()
{
    if(!mouse_is_down) {
        return;
    }

    mouse_moved = true;

    const x = to_int(get_mouse_x() / CellSize);
    const y = to_int(get_mouse_y() / CellSize);

    if(mouse_last_x == x && mouse_last_y == y) {
        return;
    }

    mouse_last_x = x;
    mouse_last_y = y;

    CurrState[y][x] = !CurrState[y][x];
}

//------------------------------------------------------------------------------
function
OnMouseClick()
{
    if(mouse_moved) {
        return;
    }

    const x = to_int(get_mouse_x() / CellSize);
    const y = to_int(get_mouse_y() / CellSize);
    CurrState[y][x] = !CurrState[y][x];
}



//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_standalone_mode()
{
    return new Promise((resolve, reject)=>{
        demolib_load_all_scripts(__SOURCES).then(()=> { // Download all needed scripts.
            // Create the standalone canvas.
            const canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);

            // Setup the listener for gif recording.
            gif_setup_listeners();

            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed();
    set_main_canvas(canvas);
    install_input_handlers(canvas, {
        on_mouse_move: OnMouseMove,
        on_mouse_down: OnMouseDown,
        on_mouse_up:   OnMouseUp,
        on_mouse_left_click: OnMouseClick
    });

    CreateGame(CellSize);

    start_draw_loop(draw);
}



//------------------------------------------------------------------------------
function demo_main(user_canvas)
{
    if(!user_canvas) {
        setup_standalone_mode().then((canvas)=>{
            setup_common(canvas);
        });
    } else {
        canvas = user_canvas;
        setup_common();
    }

}

//------------------------------------------------------------------------------
function draw(dt)
{
    begin_draw();
        DrawCurrState();
        if(mouse_is_down) {
            return;
        }

        if(get_total_time() > NextUpdateTime) {
            NextUpdateTime = (get_total_time() + TIME_TO_UPDATE);
            ApplyRules();
        }
    end_draw();
}
