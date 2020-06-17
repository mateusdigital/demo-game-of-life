//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const PROJECT_TITLE        = "<b>Title:</b>Game of Life<br>";
const PROJECT_DATE         = "<b>Date:</b>Jul 17, 2020<br>";
const PROJECT_VERSION      = "<b>Version:</b> " + GetVersion() + "<br>";
const PROJECT_INSTRUCTIONS = "<br><br>";
const PROJECT_LINK         = "<a href=\"http://stdmatt.com/demos/game_of_life.html\">More info</a>";


const TIME_TO_UPDATE_MIN = 0.05;
const TIME_TO_UPDATE_MAX = 1.0;
const TIME_TO_UPDATE_INITIAL_RATIO = 0.5;

const CELL_SIZE_MIN = 3;
const CELL_SIZE_MAX = 20;
const CELL_SIZE_INITIAL_RATIO = 0.5;

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let DrawGrid     = true;
let TimeToUpdate = Math_Lerp(TIME_TO_UPDATE_MIN, TIME_TO_UPDATE_MAX, TIME_TO_UPDATE_INITIAL_RATIO);
let AutoUpdate   = false;

let CurrentTime    = 0;
let NextUpdateTime = 0;

let CellSize = Math_Lerp(CELL_SIZE_MIN, CELL_SIZE_MAX, CELL_SIZE_INITIAL_RATIO);
let CurrState = null;
let NextState = null;

let FieldCols = 0;
let FieldRows = 0;

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

//------------------------------------------------------------------------------
function
CreateControlsUI()
{
    const parent = document.getElementById("canvas_div");

    //
    // Simuation Update.
    DOM_CreateButton(
        "Step",
        ()=>{
            ApplyRules();
            checkbox.checkbox.checked = false;
            AutoUpdate = false;
        },
        parent
    );

    DOM_CreateSlider(
        "Time to Update",
        TIME_TO_UPDATE_MIN,
        TIME_TO_UPDATE_MAX,
        TIME_TO_UPDATE_INITIAL_RATIO,
        0.1,
        null,
        (v)=>{
            TimeToUpdate = v;
            console.log(TimeToUpdate);
        },
        parent
    );

    const checkbox =  DOM_CreateCheckbox(
        "Auto Update",
        false,
        (v)=>{
            AutoUpdate = v;
        },
        parent
    );

    //
    // Cell Size
    DOM_CreateSlider(
        "Cell Size",
        CELL_SIZE_MIN,
        CELL_SIZE_MAX,
        CELL_SIZE_INITIAL_RATIO,
        1,
        null,
        (v)=>{
            CreateGame(v);
        },
        parent
    );
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

    CurrState = Array_Create2D(FieldRows, FieldCols, null);
    NextState = Array_Create2D(FieldRows, FieldCols, null);
}

//------------------------------------------------------------------------------
function
CountNeighbours(state, y, x)
{
    let count = 0;
    for(let i = y-1; i <= y+1; ++i) {
        if(i < 0 || i >= state.length) {
            continue;
        }

        for(let j = x-1; j <= x+1; ++j) {
            if(i == y && j == x) {
                continue;
            }

            if(j < 0 || j >= state[i].length) {
                continue;
            }

            if(state[i][j]) {
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
    Canvas_SetFillStyle("black");
    Canvas_FillRect(0, 0, Canvas_Width, Canvas_Height);

    //
    // Draw the Classic Visualization.
    if(DrawGrid) {
        const rows = CurrState.length;
        const cols = CurrState[0].length;
        for(let i = 0; i < rows; ++i) {
            for(let j = 0; j < cols; ++j) {
                const is_alive = CurrState[i][j];
                if(is_alive) {
                    Canvas_SetFillStyle("black");
                } else {
                    Canvas_SetFillStyle("red");
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
    CreateControlsUI();
    AddInfo         ();

    //
    Random_Seed(1);
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
    if(AutoUpdate && !mouse_is_down) {
        if(Time_Total > NextUpdateTime) {
            NextUpdateTime = (Time_Total + TimeToUpdate);
            ApplyRules();
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
