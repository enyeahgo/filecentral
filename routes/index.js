var express = require('express');
var router = express.Router();
var fs = require('fs');
var upload = require('../upload');

// Helpers
var top = require('../helpers/top');
var footer = require('../helpers/footer');
var bottom = require('../helpers/bottom');
var clientSocket = require('../helpers/clientSocket');
var swals = require('../helpers/swals');
var closing = require('../helpers/closing');

router.get('/', (req, res) => {
  res.send(`
    ${top('File Central')}
    ${footer}
    ${bottom}
    ${closing}
  `);
});

router.get('/upload', (req, res) => {
  res.send(`
    ${top('Upload')}
    <div class="card shadow-sm">
      <div class="card-header bg-success text-light d-flex justify-content-between">
        <span>Upload File</span>
        <button id="submitBtn" class="btn btn-primary btn-sm headerBtn" onclick="submitForm()" disabled>Submit</button>
      </div>
      <div class="card-body">
        <form id="form" method="post" action="/upload" enctype="multipart/form-data">
          <div class="form-group mb-3">
            <select class="form-control" name="staff" id="staff">
              <option selected disabled>Choose Folder</option>
              <option value="co">CO</option>
              <option value="exo">EXO</option>
              <option value="fsgt">First Sgt</option>
              <option value="pers">Personnel</option>
              <option value="intel">Intelligence</option>
              <option value="ops">Operations</option>
              <option value="logs">Logistics</option>
              <option value="sig">Signal</option>
              <option value="cmo">CMO</option>
              <option value="trg">Training</option>
              <option value="fin">Finance</option>
              <option value="atr">ATR</option>
              <option value="other">Other</option>
            </select>
            <small class="form-text text-muted">Please choose folder</small>
          </div>
          <div class="form-group">
            <input type="file" accept="application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf" name="file" id="file" class="form-control" />
            <small class="form-text text-muted">Please select a file</small>
          </div>
        </form>
      </div>
    </div>
    ${footer}
    ${bottom}
    <script>
      let file = document.getElementById('file');
      let staff = document.getElementById('staff');
      let form = document.getElementById('form');
      let submitBtn = document.getElementById('submitBtn');
      
      function submitForm() {
        if(staff.selectedIndex == 0) {
          toast('Please select folder', 'error');
        } else {
          form.submit();
        }
      }
      
      file.addEventListener('change', e => {
        let f = e.target.files[0];
        if(f.type.match("application/msword") ||  f.type.match("application/vnd.ms-excel") || f.type.match("application/vnd.ms-powerpoint") || f.type.match("text/plain") || f.type.match("application/pdf")) {
          if(f.size == 0) {
            toast('File is corrupted!', 'error');
            file.value = '';
            submitBtn.disabled = true;
          } else {
            submitBtn.disabled = false;
          }
        } else {
          toast('Only PDF, WORD, EXCEL, POWERPOINT and TEXT files are allowed!', 'error');
          file.value = '';
          submitBtn.disabled = true;
        }
      })
    </script>
    ${swals}
    ${closing}
  `);
})

router.post('/upload', (req, res, next) => { var staff = req.body.staff; next(); }, upload(staff).single('file'), (req, res) => {
  res.send(req.file);
});

module.exports = router;
