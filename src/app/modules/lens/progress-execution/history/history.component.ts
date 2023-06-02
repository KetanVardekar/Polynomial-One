import { Component, OnInit } from '@angular/core';
import { DevEventModuleComponent } from '../../dev-event-module/dev-event-module.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyarray: any = [
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'Insights Gathering',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'Get Insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'update insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '40 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'remove insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '36 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '2 min 2 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
    {
      workflow: 'Insights update',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '40 s',
      btn: 'Dev_Event_Module',
      view: 'View',
    },
  ];
  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}
  addDevEventModule() {
    const modalRef = this.modalService.open(DevEventModuleComponent, {
      // windowClass: 'modal-xl,modal-content',
      size: 'lg',
      animation: true,

      keyboard: false,
    });
  }
}
