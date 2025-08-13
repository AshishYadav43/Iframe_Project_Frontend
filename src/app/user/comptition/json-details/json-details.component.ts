import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-json-details',
  imports: [CommonModule],
  templateUrl: './json-details.component.html',
  styleUrl: './json-details.component.css'
})
export class JsonDetailsComponent {
  jsontData: any

  ngOnInit(): void {
    this.jsontData = history.state.marketData;
    // this.getJsonDetails()
  }
  jsonData = {
    "_id": "6899c1d7066eae2cd61a523d",
    "event_id": "34611275",
    "marketId": "1.246563006",
    "__v": 0,
    "betDelay": 0,
    "bspReconciled": false,
    "competition_id": "12670839",
    "complete": true,
    "createdAt": "2025-08-11T10:11:35.622Z",
    "crossMatching": true,
    "inplay": false,
    "isMarketDataDelayed": true,
    "lastUpdated": "2025-08-11T10:11:35.623Z",
    "numberOfActiveRunners": 2
  };

  constructor(private location: Location,
    private http: HttpClient
  ) { }

  goBack() {
    this.location.back();
  }

  copyJson() {
    navigator.clipboard.writeText(JSON.stringify(this.jsonData, null, 2));
  }

  getJsonDetails() {
    this.http.get(`http://212.71.239.148:6050/api/newmarkets/${this.jsontData.eventId}/${this.jsontData.marketId}`, {})
      .subscribe((res: any) => {
      })
  }
}
