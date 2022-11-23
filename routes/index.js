var express = require('express');
var router = express.Router();
var fs = require('fs');
var upload = require('../upload');
var storage = require('../storage');

// Helpers
var top = require('../helpers/top');
var topWithBack = require('../helpers/topWithBack');
var footer = require('../helpers/footer');
var bottom = require('../helpers/bottom');
var clientSocket = require('../helpers/clientSocket');
var swals = require('../helpers/swals');
var closing = require('../helpers/closing');
var move = require('../helpers/move');

router.get('/', (req, res) => {
  res.send(`
    ${top('File Central')}
    <div class="card">
      <div class="card-body p-0">
        <ul class="list-group">
          <a href="/upload" class="list-group-item">Upload</a>
          <a href="/view" class="list-group-item">View</a>
        </ul>
      </div>
    </div>
    ${footer}
    ${bottom}
    ${closing}
  `);
});

router.get('/upload', (req, res) => {
  res.send(`
    ${topWithBack('Upload')}
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
              <option value="CO">CO</option>
              <option value="EXO">EXO</option>
              <option value="FSgt">First Sgt</option>
              <option value="Maint">Maintenance</option>
              <option value="S1">Personnel</option>
              <option value="S2">Intelligence</option>
              <option value="S3">Operations</option>
              <option value="S4">Logistics</option>
              <option value="S6">Signal</option>
              <option value="S7">CMO</option>
              <option value="S8">Training</option>
              <option value="Finance">Finance</option>
              <option value="ATR">ATR</option>
              <option value="Other">Other</option>
            </select>
            <small class="form-text text-muted">Please choose folder</small>
          </div>
          <div class="form-group mb-3">
          	<select class="form-control" name="subfolder" id="subfolder">
              <option selected disabled>Choose Sub-Folder</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Semi-Annual">Semi-Annual</option>
              <option value="Annual">Annual</option>
              <option value="Requests">Requests</option>
              <option value="Messages">Messages</option>
              <option value="Other">Other</option>
            </select>
            <small class="form-text text-muted">Please choose sub-folder</small>
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
      let subfolder = document.getElementById('subfolder');
      let form = document.getElementById('form');
      let submitBtn = document.getElementById('submitBtn');
      
      function submitForm() {
        if(staff.selectedIndex == 0) {
          toast('Please select folder', 'error');
        } else {
          if(subfolder.selectedIndex == 0) {
            toast('Please select sub-folder', 'error');
          } else {
            form.submit();
          }
        }
      }
      
      file.addEventListener('change', e => {
        let f = e.target.files[0];
        if(f.type.match("application/msword") ||  f.type.match("application/vnd.msexcel") || f.type.match("application/vnd.mspowerpoint") || f.type.match("text/plain") || f.type.match("application/pdf")) {
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

router.get('/upload_', (req, res) => {
  res.send(`
    ${topWithBack('Upload')}
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
              <option value="CO">CO</option>
              <option value="EXO">EXO</option>
              <option value="FSgt">First Sgt</option>
              <option value="Maint">Maintenance</option>
              <option value="S1">Personnel</option>
              <option value="S2">Intelligence</option>
              <option value="S3">Operations</option>
              <option value="S4">Logistics</option>
              <option value="S6">Signal</option>
              <option value="S7">CMO</option>
              <option value="S8">Training</option>
              <option value="Finance">Finance</option>
              <option value="ATR">ATR</option>
              <option value="Other">Other</option>
            </select>
            <small class="form-text text-muted">Please choose folder</small>
          </div>
          <div class="form-group mb-3">
          	<select class="form-control" name="subfolder" id="subfolder">
              <option selected disabled>Choose Sub-Folder</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Semi-Annual">Semi-Annual</option>
              <option value="Annual">Annual</option>
              <option value="Requests">Requests</option>
              <option value="Messages">Messages</option>
              <option value="Other">Other</option>
            </select>
            <small class="form-text text-muted">Please choose sub-folder</small>
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
      window.addEventListener('load', () => {
        toast('Upload successful!', 'success');
      });
      let file = document.getElementById('file');
      let staff = document.getElementById('staff');
      let subfolder = document.getElementById('subfolder');
      let form = document.getElementById('form');
      let submitBtn = document.getElementById('submitBtn');
      
      function submitForm() {
        if(staff.selectedIndex == 0) {
          toast('Please select folder', 'error');
        } else {
          if(subfolder.selectedIndex == 0) {
            toast('Please select sub-folder', 'error');
          } else {
            form.submit();
          }
        }
      }
      
      file.addEventListener('change', e => {
        let f = e.target.files[0];
        if(f.type.match("application/msword") ||  f.type.match("application/vnd.msexcel") || f.type.match("application/vnd.mspowerpoint") || f.type.match("text/plain") || f.type.match("application/pdf")) {
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

router.post('/upload', upload.single('file'), (req, res) => {
  move(req.file.path, `${storage}${req.body.staff}/${req.file.filename}`, err => {
    if(err) {
      res.send(err);
    } else {
      res.redirect('/upload_');
    }
  });
});

router.get('/view', (req, res) => {
  fs.readdir(storage, (err, files) => {
    if(err) {
      res.send(err)
    } else {
      res.send(files)
    }
  });
  /*res.send(`
    ${topWithBack('View')}
    <div class="container-fluid">
      <div class="row d-flex justify-content-between">
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">CO</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">EXO</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">FSgt</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S1</p>
        </div>
      </div>
      <div class="row d-flex justify-content-between">
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S2</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S3</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S4</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S6</p>
        </div>
      </div>
      <div class="row d-flex justify-content-between">
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S7</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">S8</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">Finance</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">ATR</p>
        </div>
      </div>
      <div class="row d-flex justify-content-between">
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">Maint</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">1Sct Pltn</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">2Sct Pltn</p>
        </div>
        <div class="col-3 text-center">
          <img src="/folder.png" width="50px" />
          <p class="text-center">Other</p>
        </div>
      </div>
    </div>
    ${footer}
    ${bottom}
    ${swals}
    ${closing}
  `);*/
});

module.exports = router;
