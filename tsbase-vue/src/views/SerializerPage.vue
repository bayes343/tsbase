<template>
  <div class="serializer-page">
    <h1>Serializers</h1>
    <div>
      <h2>JsonSerializer</h2>
      <p>Serializes raw json data into an instance of T</p>
      <div class="action-area">
        <div class="left-section">
          <h3>Source Data</h3>
          <pre>
{ 
  "people": [
    {
      "firstName": "Joseph",
      "lastName": "Bayes",
      "age": 28,
      "pets": [
        {
          "name": "Freya",
          "species": "Dog"
        },
        {
          "name": "Loki",
          "species": "Cat"
        }
      ]
    },
    {
      "firstName": "Shauna",
      "lastName": "Bayes",
      "age": 28,
      "pets": [
        {
          "name": "Freya",
          "species": "Dog"
        },
        {
          "name": "Loki",
          "species": "Cat"
        }
      ]
    },
    {
      "firstName": "Karoline",
      "lastName": "Bayes",
      "age": 3,
      "pets": [
        {
          "name": "Freya",
          "species": "Dog"
        },
        {
          "name": "Loki",
          "species": "Cat"
        }
      ]
    },
    {
      "firstName": "Tristan",
      "lastName": "Bayes",
      "age": 1,
      "pets": [
        {
          "name": "Freya",
          "species": "Dog"
        },
        {
          "name": "Loki",
          "species": "Cat"
        }
      ]
    }
  ]
}
          </pre>
        </div>

        <div class="right-section">
          <h3>Desired Classes</h3>
          <pre>
class Person {
  public firstName = '';
  public lastName = '';
  public age = 0;

  public complain(): string {
    return 'Life\'s too hard... :(';
  }
}

class Pet {
  public name = '';
  public species = SpeciesType.Dog;

  public call(): string {
    return this.getCall();
  }
}
          </pre>
          <div class="center-content">
            <button v-on:click="serializeData">Serialize Data</button>
          </div>
          <div v-if="actionsAvailable" class="center-content">
            <button v-on:click="handleAction('joey')">Make Joey "Complain"</button>
            <button v-on:click="handleAction('freya')">Make Freya "Call"</button>
            <button v-on:click="handleAction('loki')">Make Loki "Call"</button>
          </div>
          <h4>Output:</h4>
          <p>{{output}}</p>
        </div>
      </div>
    </div>
    <div class="summary">
      <h2>Summary</h2>
      <p>The above example shows how the JsonSerializer can take raw json data and use it to instantiate class instances.</p>
      <p>This allows you to call methods and use other instance members normally available to class instances but not, say, stringified json objects.</p>

      <div class="code-example">
        <h3>Example code:</h3>
        <code>
          <p class="comment">// Get your JSON data</p>
          <p>const peopleDataObj = JSON.parse(peopleRestResponse);</p>
          <p class="comment">// Instantiate a JsonSerailizer</p>
          <p>const serializer = new JsonSerializer&lt;Person&gt;();</p>
          <p class="comment">// Use the serializer to trade JSON data for class instances</p>
          <pre>
for (const person of peopleDataObj["people"]) {
  this.people.Add(serializer.Serialize(Person, person));
}
        </pre>
        </code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { JsonSerializer, List } from "tsbase";
import { Person } from "../domain/Person";
import { peopleData } from "../stub-data";
import { DomStoragePersister } from "tsbase";

@Component
export default class SerializerPage extends Vue {
  public people = new List<Person>();
  public output = "";
  public actionsAvailable = false;

  public serializeData(): void {
    const peopleDataObj = JSON.parse(peopleData);
    const serializer = new JsonSerializer<Person>();
    for (const person of peopleDataObj["people"]) {
      this.people.Add(serializer.Serialize(Person, person));
    }
    this.actionsAvailable = true;
  }

  public handleAction(action: "joey" | "freya" | "loki"): void {
    switch (action) {
      case "joey":
        this.output = this.people
          .Find(item => item.firstName === "Joseph")
          .complain();
        break;
      case "loki":
        this.output = this.people.Item[0].pets
          .find(item => item.species === "Cat")
          .call();
        break;
      case "freya":
        this.output = this.people.Item[0].pets
          .find(item => item.species === "Dog")
          .call();
      default:
        break;
    }
  }
}
</script>

<style lang="scss">
@import "../global-styles.scss";
.action-area {
  margin-top: 50px;
  margin-left: 6%;
  margin-right: 6%;
  text-align: left;
  display: flex;
  justify-content: center;
  .left-section,
  .right-section {
    border: 1px solid black;
    margin: 20px;
    padding: 20px;
    max-height: 65vh;
    width: calc(50% - 100px);
    overflow: scroll;
    overflow-x: hidden;
  }
  .center-content {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    button {
      margin: 5px;
    }
  }
  button {
    height: 40px;
  }
}
.summary {
  margin-top: 50px;
  margin-bottom: 100px;
}
</style>

