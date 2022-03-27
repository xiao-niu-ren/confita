// Copyright 2022 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package service

import (
	"encoding/json"

	"github.com/astaxie/beego"
	"github.com/casdoor/casdoor-go-sdk/auth"
)

type Payment struct {
	Owner       string `xorm:"varchar(100) notnull pk" json:"owner"`
	Name        string `xorm:"varchar(100) notnull pk" json:"name"`
	CreatedTime string `xorm:"varchar(100)" json:"createdTime"`
	DisplayName string `xorm:"varchar(100)" json:"displayName"`

	Provider     string `xorm:"varchar(100)" json:"provider"`
	Type         string `xorm:"varchar(100)" json:"type"`
	Organization string `xorm:"varchar(100)" json:"organization"`
	User         string `xorm:"varchar(100)" json:"user"`
	ProductId    string `xorm:"varchar(100)" json:"productId"`
	ProductName  string `xorm:"varchar(100)" json:"productName"`

	Detail   string  `xorm:"varchar(100)" json:"detail"`
	Tag      string  `xorm:"varchar(100)" json:"tag"`
	Currency string  `xorm:"varchar(100)" json:"currency"`
	Price    float64 `json:"price"`

	PayUrl    string `xorm:"varchar(2000)" json:"payUrl"`
	ReturnUrl string `xorm:"varchar(1000)" json:"returnUrl"`
	State     string `xorm:"varchar(100)" json:"state"`
}

func GetPayments(user string) ([]*Payment, error) {
	owner := "admin"
	organization := beego.AppConfig.String("casdoorOrganization")

	queryMap := map[string]string{
		"owner":        owner,
		"organization": organization,
		"user":         user,
	}

	url := auth.GetUrl("get-user-payments", queryMap)

	bytes, err := auth.DoGetBytes(url)
	if err != nil {
		return nil, err
	}

	var payments []*Payment
	err = json.Unmarshal(bytes, &payments)
	if err != nil {
		return nil, err
	}
	return payments, nil
}