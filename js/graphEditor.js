class GraphEditor {
  constructor(canvas, graph) {
    this.canvas = canvas
    this.graph = graph

    this.ctx = this.canvas.getContext("2d")

    this.selected = null
    this.hovered = null
    this.dragging = false
    this.mouse = null

    this.#addEventListeners()
  }

  #addEventListeners() {

    this.canvas.addEventListener("mousedown",
      this.#handleMouseDown.bind(this)
    )

    this.canvas.addEventListener("mousemove",this.#handleMouseMove.bind(this))

    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())
    this.canvas.addEventListener("mouseup", () => this.dragging = false)
  }

  #handleMouseDown(e) {
    if (e.button === 2) { //right click
        
      if(this.selected) {
        this.selected = null
      } else if (this.hovered){
        this.#removePoint(this.hovered)
      }
    }

    if (e.button === 0) { //left click
      if (this.hovered) {
        this.#select(this.hovered)
        this.dragging = true
        return
      }

      this.graph.addPoint(this.mouse)

      this.#select(this.mouse)
      this.hovered = this.mouse
    }
  }

  #handleMouseMove (e) {
    this.mouse = new Point(e.offsetX, e.offsetY)
    this.hovered = getNearestPoint(this.mouse, this.graph.points, 10)
    if (this.dragging) {
      this.selected.x = this.mouse.x
      this.selected.y = this.mouse.y
    }
  }
  
  #select(point) {
    if (this.selected) {
      this.graph.tryAddSegment(
        new Segment(this.selected, point)
      )
    }
    this.selected = point
  }

  #removePoint(point) {
    this.graph.removePoint(point)
    this.hovered = null

    if (this.selected === point) {
      this.selected = null
    }
  }

  display() {
    this.graph.draw(this.ctx)

    if(this.hovered) {
      this.hovered.draw(this.ctx, {fill: true})
    }

    if(this.selected) {
      
      const intend = this.hovered ?? this.mouse
      new Segment(this.selected, intend).draw(this.ctx, {dash: [3,3]})
      this.selected.draw(this.ctx, {outline: true})
    }

  }

}