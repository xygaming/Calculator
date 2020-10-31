import React, {createRef, MouseEvent, RefObject } from 'react';
import './App.css';

class App extends React.Component {
  state: {
    operation: string,
    numIn: number,
    solut: number,
    canIn: boolean,
    first: boolean,
    showingSolut: boolean,
    opChange: boolean,
  }
  nums: RefObject<HTMLSpanElement>;
  buttons: JSX.Element[] = [];
  constructor(props: React.ReactPropTypes){
    super(props);
    this.nums = createRef();
    let j: number = 0;
    for (let i = 1; i < 10; i+=3) {
      j++;
      this.buttons.unshift(
        <tr key={j}>
          <td id={"Row" + j.toString()}>
            <button key={i} id={i.toString()} onClick={(e)=>this.addNewNum(e)}>{i}</button>
            <button key={i+1} id={(i+1).toString()} onClick={(e)=>this.addNewNum(e)}>{i+1}</button>
            <button key={i+2} id={(i+2).toString()} onClick={(e)=>this.addNewNum(e)}>{i+2}</button>
          </td>
        </tr>
      )
    }
    this.state = {
      operation: "null",
      numIn: 0,
      solut: 0,
      canIn: true,
      first: true,
      showingSolut: false,
      opChange: true,
    }
  }
  addNewNum(e: MouseEvent<HTMLButtonElement>) {
    const num: string = (e.target as HTMLButtonElement).id;
    if (this.state.canIn && !this.state.showingSolut) {
      if (document.getElementById("nums")?.textContent !== "0" || num === ".") {
        if (num === "." && document.getElementById("nums")?.textContent?.split("").includes(".")) {
          return null
        }
        (document.getElementById("nums") as HTMLSpanElement).textContent += num;
      } else {
          (document.getElementById("nums") as HTMLSpanElement).textContent = num;
      }
    } else if (this.state.canIn && this.state.showingSolut) {
      (document.getElementById("nums") as HTMLSpanElement).textContent = num;
      this.setState({
        showingSolut: false,
      })
    }
    this.setState({
      opChange: true,
    })
  }
  addNewNumKey(e: Event) {
    const num: string = (e as KeyboardEvent).key;
    if (parseInt(num) || num === ".") {
      if (this.state.canIn && !this.state.showingSolut) {
        if (document.getElementById("nums")?.textContent !== "0" || num === ".") {
          if (num === "." && document.getElementById("nums")?.textContent?.split("").includes(".")) {
            return null
          }
          (document.getElementById("nums") as HTMLSpanElement).textContent += num;
        } else {
            (document.getElementById("nums") as HTMLSpanElement).textContent = num;
        }
      } else if (this.state.canIn && this.state.showingSolut) {
        (document.getElementById("nums") as HTMLSpanElement).textContent = num;
        this.setState({
          showingSolut: false,
        })
      }
      this.setState({
        opChange: true,
      })
    }
  }
  operation(e: MouseEvent<HTMLButtonElement> | Event) {
    if (this.state.canIn) {
      const operation: string = (e.target as HTMLButtonElement).id;
      const tempNum: number = parseFloat((document.getElementById("nums") as HTMLSpanElement).textContent as string);
      if (this.state.first) {
        this.setState({
          operation: operation,
          numIn: tempNum,
          solut: tempNum,
          first: false,
        }, () => {
          this.clear();
        });
      } else if (this.state.opChange) {
        switch (this.state.operation) {
          case "plus":
            this.setState({
              operation: operation,
              solut: this.state.solut + tempNum,
              numIn: tempNum,
              opChange: false,
            }, () => {
              this.showSolut();
            })
            break
          case "minus":
            this.setState({
              operation: operation,
              solut: this.state.solut - tempNum,
              numIn: tempNum,
              opChange: false,
            }, () => {
              this.showSolut();
            })
            break
          case "multiply":
            this.setState({
              operation: operation,
              solut: this.state.solut * tempNum,
              numIn: tempNum,
              opChange: false,
            }, () => {
              this.showSolut();
            })
            break
          case "divide":
            if (tempNum) {
              this.setState({
                operation: operation,
                solut: this.state.solut / tempNum,
                numIn: tempNum,
                opChange: false,
              }, () => {
                this.showSolut();
              })
            } else {
              this.setState({
                canIn: false,
              }, () => {
                (document.getElementById("nums") as HTMLSpanElement).textContent = "DivideByZeroException";
              })
            }
            break
        }
      }
    }
  }
  solve() {
    const tempNum: number = parseFloat((document.getElementById("nums") as HTMLSpanElement).textContent as string);
    switch (this.state.operation) {
      case "plus":
        this.setState({
          solut: this.state.solut + tempNum,
          numIn: tempNum,
          canIn: false,
        }, () => {
          this.showSolut();
        })
        break
      case "minus":
        this.setState({
          solut: this.state.solut - tempNum,
          numIn: tempNum,
          canIn: false,
        }, () => {
          this.showSolut();
        })
        break
      case "multiply":
        this.setState({
          solut: this.state.solut * tempNum,
          numIn: tempNum,
          canIn: false,
        }, () => {
          this.showSolut();
        })
        break
      case "divide":
        if (tempNum) {
          this.setState({
            solut: this.state.solut / tempNum,
            numIn: tempNum,
            canIn: false,
          }, () => {
            this.showSolut();
          })
        } else {
          this.setState({
            canIn: false,
          }, () => {
            (document.getElementById("nums") as HTMLSpanElement).textContent = "DivideByZeroException";
          })
        }
        break
    }
  }
  showSolut() {
    (document.getElementById("nums") as HTMLSpanElement).textContent = this.state.solut.toString();
    this.setState({
      showingSolut: true,
    })
  }
  clear() {
    (document.getElementById("nums") as HTMLSpanElement).textContent = "0";
  }
  reset() {
    this.setState({
      operation: "null",
      numIn: 0,
      solut: 0,
      canIn: true,
      first: true,
      showingSolut: false,
      opChange: true,
    }, () => (document.getElementById("nums") as HTMLSpanElement).textContent = "0");
  }
  render() {
    return (
      <div className="container">
        <table>
          <tbody>
            <tr>
              <td className="numContain">
                <span id="nums" ref={this.nums}>0</span>
              </td>
            </tr>
            <tr>
              <td>
                <button id="clear" onClick={() => this.reset()}>
                  Clear
                </button>
              </td>
            </tr>
            {this.buttons}
            <tr>
              <td>
                <button id="0" onClick={(e) => this.addNewNum(e)}>
                  0
                </button>
                <button id="." onClick={(e) => this.addNewNum(e)}>
                  .
                </button>
                <button id="equals" onClick={() => this.solve()}>
                  =
                </button>
                <button id="plus" onClick={(e) => this.operation(e)}>
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <p>YAY BROKEN CALCULATOR TIME!</p>
        <p><sub>who gave this man the ability to code {"\uD83E\uDD2E"}</sub></p> */}
        <p>If you want a negative number, just hit the subtract button first; you will be subtracting your number from 0!</p>
      </div>
    );
  }
  componentDidMount() {
    const add1: Element = document.createElement("button");
    add1.setAttribute("id", "minus");
    add1.addEventListener("click", (e) => this.operation(e));
    const add1Text: Node = document.createTextNode("-");
    add1.appendChild(add1Text);
    (document.getElementById("Row1") as HTMLTableDataCellElement).appendChild(add1);

    const add2: Element = document.createElement("button");
    add2.setAttribute("id", "multiply");
    add2.addEventListener("click", (e) => this.operation(e));
    const add2Text: Node = document.createTextNode("*");
    add2.appendChild(add2Text);
    (document.getElementById("Row2") as HTMLTableDataCellElement).appendChild(add2);

    const add3: Element = document.createElement("button");
    add3.setAttribute("id", "divide");
    add3.addEventListener("click", (e) => this.operation(e));
    const add3Text: Node = document.createTextNode("/");
    add3.appendChild(add3Text);
    (document.getElementById("Row3") as HTMLTableDataCellElement).appendChild(add3);

    document.addEventListener("keydown", (e) => this.addNewNumKey(e));
  }
}

export default App;