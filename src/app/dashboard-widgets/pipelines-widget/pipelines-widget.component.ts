import { PipelinesService } from './../../shared/runtime-console/pipelines.service';
import { Observable } from 'rxjs/Rx';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';

import {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  BuildConfigStore,
  BuildStore
} from 'fabric8-runtime-console';

import { Fabric8RuntimeConsoleService } from './../../shared/runtime-console/fabric8-runtime-console.service';

import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-pipelines-widget',
  templateUrl: './pipelines-widget.component.html',
  styleUrls: ['./pipelines-widget.component.scss']
})
export class PipelinesWidgetComponent implements OnInit {

  buildConfigs: Observable<BuildConfigs>;
  buildConfigsCount: Observable<number>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private pipelinesService: PipelinesService
  ) { }

  ngOnInit() {
    let bcs = this.pipelinesService.current
      .publish();
    this.buildConfigs = bcs;
    this.buildConfigsCount = bcs.map(buildConfigs => buildConfigs.length);
    bcs.connect();
  }

}
