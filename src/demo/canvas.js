// super basic mock
const win = typeof window !== 'undefined' ? window : {}
const doc = typeof document !== 'undefined' ? document : {}

const width = win.innerWidth || 1024
const height = win.innerHeight || 768

class TestCanvas {
  constructor(test) {
    this.test = test

    if (doc.createElement) {
      this.element = doc.createElement('div')
      this.element.id = 'debug'
      this.element.innerHTML = `${this.test.legend}
    <div>
      <label>
        <input id="bvh" type="checkbox"/> Show Bounding Volume Hierarchy
      </label>
    </div>`

      this.canvas = doc.createElement('canvas')
      this.canvas.width = width
      this.canvas.height = height

      this.context = this.canvas.getContext('2d')
      this.context.font = '24px Arial'
      this.test.context = this.context

      this.bvhCheckbox = this.element.querySelector('#bvh')

      if (this.canvas) {
        this.element.appendChild(this.canvas)
      }

      this.fps = 0
      this.frame = 0
      this.started = Date.now()
    }

    loop(this.update.bind(this))
  }

  update() {
    this.frame++

    if (!this.test.headless) {
      const timeDiff = Date.now() - this.started
      if (timeDiff >= 1000) {
        this.fps = this.frame / (timeDiff / 1000)
        this.frame = 0
        this.started = Date.now()
      }

      // Clear the canvas
      this.context.fillStyle = '#000000'
      this.context.fillRect(0, 0, width, height)

      // Render the bodies
      this.context.strokeStyle = '#FFFFFF'
      this.context.beginPath()
      this.test.check2d.draw(this.context)
      this.context.stroke()

      // Render the BVH
      if (this.bvhCheckbox.checked) {
        this.context.strokeStyle = '#00FF00'
        this.context.beginPath()
        this.test.check2d.drawBVH(this.context)
        this.context.stroke()
      }

      // Render the FPS
      this.context.fillStyle = '#FFCC00'
      this.context.fillText(
        `FPS: ${this.fps ? this.fps.toFixed(0) : '?'}`,
        24,
        48
      )
    }

    if (this.test.drawCallback) {
      this.test.drawCallback()
    }
  }
}

function loop(callback) {
  // interval for fps instead of setTimeout
  // and ms = 1 which is lowest nonzero value
  // for responsiveness of user input
  setInterval(callback, 1)
}

module.exports.TestCanvas = TestCanvas

module.exports.loop = loop

module.exports.win = win

module.exports.doc = doc

module.exports.width = width

module.exports.height = height
