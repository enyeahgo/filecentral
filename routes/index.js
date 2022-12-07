var express = require('express');
var router = express.Router();
var fs = require('fs');
var fss = require('fs-sync');
var upload = require('../upload');
var storage = require('../storage');

// Helpers
var top = require('../helpers/top');
var topWithBack = require('../helpers/topWithBack');
var topWithBackLink = require('../helpers/topWithBackLink');
var footer = require('../helpers/footer');
var bottom = require('../helpers/bottom');
var clientSocket = require('../helpers/clientSocket');
var swals = require('../helpers/swals');
var closing = require('../helpers/closing');
var move = require('../helpers/move');

router.get('/', (req, res) => {
  fs.readdir(storage, (err, files) => {
    if(err) {
      res.send(err)
    } else {
      let folders = '';
      files.map(file => {
        folders += `
          <div class="col-3 text-center" ondblclick="location.href = '/open/${file}';">
            <img src="/folder.png" width="50px" />
            <p class="text-center">${file}</p>
          </div>
        `;
      });
      res.send(`
        ${top('File Central')}
        <div class="container-fluid">
          <div class="row d-flex justify-content-center">
            ${folders}
          </div>
        </div>
        ${bottom}
        ${footer}
        ${swals}
        ${closing}
      `);
    }
  });
});

router.get('/upload/:folder', (req, res) => {
  let uploadTo = storage+req.params.folder.split('_').join('/');
  res.send(`
    ${topWithBackLink('Upload', '/open/${req.params.folder}')}
    <div class="card shadow-sm">
      <div class="card-header bg-success text-light d-flex justify-content-between">
        <span>${req.params.folder.split('_').join('/')}</span>
        <button id="submitBtn" class="btn btn-primary btn-sm headerBtn" onclick="submitForm()" disabled>Submit</button>
      </div>
      <div class="card-body">
        <form id="form" method="post" action="/upload" enctype="multipart/form-data">
          <input type="hidden" name="folder" id="folder" value="${uploadTo}" />
          <input type="hidden" name="goto" id="goto" value="/open/${req.params.folder}" />
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
      let folder = document.getElementById('folder');
      let form = document.getElementById('form');
      let submitBtn = document.getElementById('submitBtn');
      
      function submitForm() {
        form.submit();
      }
      
      file.addEventListener('change', e => {
        let f = e.target.files[0];
        /*if(f.type.match("application/ms-word") ||  f.type.match("application/vnd.ms-excel") || f.type.match("application/vnd.ms-powerpoint") || f.type.match("text/plain") || f.type.match("application/pdf")) {*/
          if(f.size == 0) {
            toast('File is corrupted!', 'error');
            file.value = '';
            submitBtn.disabled = true;
          } else {
            submitBtn.disabled = false;
          }
        /*} else {
          toast('Only PDF, WORD, EXCEL, POWERPOINT and TEXT files are allowed!', 'error');
          file.value = '';
          submitBtn.disabled = true;
        } */
      })
    </script>
    ${swals}
    ${closing}
  `);
})

router.post('/upload', upload.single('file'), (req, res) => {
  move(req.file.path, `${req.body.folder}/${req.file.filename}`, err => {
    if(err) {
      res.send(err);
    } else {
      res.redirect(req.body.goto);
    }
  });
});

router.get('/open/:staff', (req, res) => {
  let openWhatFolder = '';
  let folderSystem = req.params.staff.split('_');
  folderSystem.map(dir => {
    openWhatFolder += `${dir}/`;
  });
  fs.readdir(`${storage}${openWhatFolder}`, (err, files) => {
    if(err) {
      res.send(err)
    } else {
      let content = '';
			let icon = '/folder.png';
			let canUpload = false;
			let isFile = false;
			let header = '';
			files.map(file => {
				if(fs.lstatSync(`${storage}${openWhatFolder}${file}`).isFile()) {
					canUpload = true;
					isFile = true;
					icon = '/file.png'
				}
				if(isFile) {
  				content += `
  					<li class="list-group-item">
  						<span class="unselectable" onclick="location.href = '/storage/${openWhatFolder}${file}';">${file}</span>&nbsp;&nbsp;<img src="/bin.png" width="20px" onclick="deleteFile('${openWhatFolder}${file}', '${req.params.staff}')" />
  					</li>
  				`;
				} else {
  				content += `
  					<li class="list-group-item" ondblclick="location.href = '/open/${req.params.staff}_${file}';">
  						<img src="${icon}" width="20px" /><span class="unselectable">&nbsp;&nbsp;${file}</span>
  					</li>
  				`;
				}
			});
    	if(canUpload || folderSystem.length >= 4) {
				header += `
					<div class="card-header bg-success text-light d-flex justify-content-between">
						<span>${openWhatFolder}</span>
						<button class="btn btn-sm btn-primary headerBtn" onclick="location.href = '/upload/${req.params.staff}';">Upload</button>
					</div>
				`;
    	} else {
    		header += `
					<div class="card-header bg-success text-light d-flex justify-content-between">
						<span>${openWhatFolder}</span>
					</div>
				`;
    	}
      res.send(`
        ${topWithBackLink(folderSystem[0], 'javascript: history.back();')}
        <div class="card shadow-sm">
        	${header}
        	<div class="card-body p-0">
        		<ul class="list-group">
        			${content}
        		</ul>
        	</div>
        </div>
        ${footer}
        ${bottom}
        <script type="text/javascript">
          function deleteFile(file, goto) {
            Swal.fire({
              title: 'Are you sure you want to delete this file?',
              text: file,
              showConfirmButton: true,
              confirmButtonText: 'Yes',
              showCancelButton: true,
              cancelButtonText: 'Back',
              allowOutsideClick: false
            }).then(result => {
              if(result.isConfirmed) {
                axios.post('/delete', {
                  file: file,
                  goto: goto
                }).then(response => {
                  location.href = response.data;
                }).catch(err => {
                  toast(err, 'error');
                });
              }
            });
          }
        </script>
        ${swals}
        ${closing}
      `);
    }
  });
});

router.post('/delete', (req, res) => {
  fss.remove(`${storage}${req.body.file}`);
  res.status(200).send(`/open/${req.body.goto}`);
})

function canUpload(path) {
	let cu = false;
	fs.readdir(path, (err, files) => {
		if(err) {
			return cu;
		} else {
			files.map(file => {
				if(fss.isFile(`${path}${file}`)) {
					cu = true;
				}
			});
			return cu;
		}
	});
}

function getIcon(path) {
	var icon = '/file.png';
	fs.stat(path, (err, stats) => {
		if(stats.isDirectory()) {
			icon = '/folder.png';
		}
		return icon;
	});
}

module.exports = router;
