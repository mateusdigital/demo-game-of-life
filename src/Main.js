//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const PROJECT_TITLE        = "<b>Title:</b>Game of Life<br>";
const PROJECT_DATE         = "<b>Date:</b>Jul 17, 2020<br>";
const PROJECT_VERSION      = "<b>Version:</b> " + GetVersion() + "<br>";
const PROJECT_INSTRUCTIONS = "<br><br>";
const PROJECT_LINK         = "<a href=\"http://stdmatt.com/demos/game_of_life.html\">More info</a>";


//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//


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

    const button = document.createElement("input");
    button.type = "button";
    button.value = "Tick";
    button.onclick = ApplyRules;

    parent.appendChild(button);
}

//----------------------------------------------------------------------------//
// Game Implementation                                                        //
//----------------------------------------------------------------------------//
let CurrState = null;
let NextState = null;

let FieldWidth  = 20;
let FieldHeight = 20;

//------------------------------------------------------------------------------
function
CreateGame()
{
    CurrState = Array_Create2D(FieldHeight, FieldWidth, false);
    NextState = Array_Create2D(FieldHeight, FieldWidth, false);
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
    NextState = Array_Create2D(FieldHeight, FieldWidth, false);

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
    const rows = CurrState.length;
    const cols = CurrState[0].length;
    const cell_w = (Canvas_Width  / cols);
    const cell_h = (Canvas_Height / rows);

    for(let i = 0; i < rows; ++i) {
        for(let j = 0; j < cols; ++j) {
            const filled = CurrState[i][j];
            if(filled) {
                Canvas_SetFillStyle("black");
            } else {
                Canvas_SetFillStyle("red");
            }

            Canvas_FillRect(
                j * cell_w,
                i * cell_h,
                cell_w -1,
                cell_h -1
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
    CreateControlsUI();
    AddInfo         ();

    //
    Random_Seed(1);
    Input_InstallBasicMouseHandler(Canvas);

    // Game.
    Canvas_Translate(-Canvas_Half_Width, -Canvas_Half_Height);
    CreateGame();

    // Game Loop.
    Canvas_Start();
}


//------------------------------------------------------------------------------
function
Draw(dt)
{
    DrawCurrState();
}

//------------------------------------------------------------------------------
function
OnMouseClick()
{
    const cell_w = (Canvas_Width  / CurrState[0].length);
    const cell_h = (Canvas_Height / CurrState.length);

    const x = Math_Int(Mouse_X / cell_w);
    const y = Math_Int(Mouse_Y / cell_h);

    console.log(x, y);
    CurrState[y][x] = !CurrState[y][x];
}

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup()
