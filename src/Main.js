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
//  Copyright : stdmatt - 2020                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const PROJECT_TITLE        = "<b>Title:</b>Game of Life<br>";
const PROJECT_DATE         = "<b>Date:</b>Jul 17, 2020<br>";
const PROJECT_VERSION      = "<b>Version:</b> " + GetVersion() + "<br>";
const PROJECT_INSTRUCTIONS = "<br>Click and drag to add more cells<br>";
const PROJECT_LINK         = "<a href=\"http://stdmatt.com/demos/game_of_life.html\">More info</a>";

const TIME_TO_UPDATE    = 0.10;
const CELL_SIZE_DEFAULT = 5;
const CLEAR_COLOR       = "black";

const COLOR_CHANGE_MULTIPLIER = 0.1;


//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let CurrentTime    = 0;
let NextUpdateTime = 0;

let CellSize = CELL_SIZE_DEFAULT;
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
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
ConfigureCanvas()
{
    const parent        = document.getElementById("canvas_div");
    const parent_width  = parent.clientWidth;
    const parent_height = parent.clientHeight;

    const max_side = Math_Max(parent_width, parent_height);
    const min_side = Math_Min(parent_width, parent_height);

    const ratio = min_side / max_side;

    // Landscape
    if(parent_width > parent_height) {
        Canvas_CreateCanvas(800, 800 * ratio, parent);
    }
    // Portrait
    else {
        Canvas_CreateCanvas(800 * ratio, 800, parent);
    }

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";
}

//------------------------------------------------------------------------------
function
AddInfo()
{
    const info = document.createElement("p");
    info.innerHTML = String_Cat(
        PROJECT_TITLE,
        PROJECT_DATE,
        PROJECT_VERSION,
        PROJECT_INSTRUCTIONS,
        PROJECT_LINK,
    )

    const parent = document.getElementById("canvas_div");
    parent.appendChild(info);
}


//----------------------------------------------------------------------------//
// Game Implementation                                                        //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
CreateGame(cell_size)
{
    CellSize = cell_size;

    FieldRows = Math_Int(Canvas_Height / CellSize);
    FieldCols = Math_Int(Canvas_Width  / CellSize);

    console.log(FieldRows, FieldCols);

    CurrState = Array_Create2D(FieldRows, FieldCols, null);
    NextState = Array_Create2D(FieldRows, FieldCols, null);

    for(let i = 0; i < FieldCols * FieldRows / 2; ++i) {
        const y = Random_Int(0, FieldRows);
        const x = Random_Int(0, FieldCols);

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

        const ii = Math_Wrap(0, state.length-1, i);
        for(let j = x-1; j <= x+1; ++j) {
            const j_out_of_bounds = (j < 0 || j >= state[ii].length);
            if(j_out_of_bounds && !AllowWrap) {
                continue;
            }

            if(i == y && j == x) {
                continue;
            }

            const jj = Math_Wrap(0, state[ii].length-1, j);
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
    NextState = Array_Create2D(FieldRows, FieldCols, null);

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
    Canvas_SetFillStyle(CLEAR_COLOR);
    Canvas_FillRect(0, 0, Canvas_Width, Canvas_Height);

    //
    const v = Math_Abs(Math_Sin(Time_Total * COLOR_CHANGE_MULTIPLIER));
    Canvas_SetFillStyle(chroma.hsl(360 * v, 0.5, 0.5));

    const rows = CurrState.length;
    const cols = CurrState[0].length;

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            const is_alive = CurrState[i][j];
            if(!is_alive) {
                continue;
            }

            Canvas_FillRect(
                j * CellSize,
                i * CellSize,
                CellSize - 1,
                CellSize - 1
            );
        }
    }
}


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function
Setup()
{
    //
    ConfigureCanvas ();
    AddInfo         ();

    //
    Random_Seed(null);
    Input_InstallBasicMouseHandler(Canvas);

    // Game.
    Canvas_Translate(-Canvas_Half_Width, -Canvas_Half_Height);
    CreateGame(CellSize);

    // Game Loop.
    Canvas_Start();
}


//------------------------------------------------------------------------------
function
Draw(dt)
{
    DrawCurrState();
    if(mouse_is_down) {
        return;
    }

    if(Time_Total > NextUpdateTime) {
        NextUpdateTime = (Time_Total + TIME_TO_UPDATE);
        ApplyRules();
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
    console.log("u[")
}

//------------------------------------------------------------------------------
function
OnMouseMove()
{
    if(!mouse_is_down) {
        return;
    }

    mouse_moved = true;

    const x = Math_Int(Mouse_X / CellSize);
    const y = Math_Int(Mouse_Y / CellSize);

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

    const x = Math_Int(Mouse_X / CellSize);
    const y = Math_Int(Mouse_Y / CellSize);
    CurrState[y][x] = !CurrState[y][x];
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup()
