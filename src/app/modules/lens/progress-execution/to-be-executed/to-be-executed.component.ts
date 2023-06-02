import { Component, OnInit } from '@angular/core';
import { DevEventModuleComponent } from '../../dev-event-module/dev-event-module.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-to-be-executed',
  templateUrl: './to-be-executed.component.html',
  styleUrls: ['./to-be-executed.component.scss'],
})
export class ToBeExecutedComponent implements OnInit {
  array: any = [
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'Insights Gathering',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'Get Insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'update insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '40 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'remove insights',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '1 min 36 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '36 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'Dev event Module',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '2 min 2 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
    },
    {
      workflow: 'Insights update',
      details:
        'Pylint Runner #224 Pull request #28 synchronize by PramodBharadwaj',
      time: '5 hours ago',
      executetime: '40 s',
      btn: 'Dev_Event_Module',
      execute: 'Execute',
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
