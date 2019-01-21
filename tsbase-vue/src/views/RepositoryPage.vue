<template>
  <div class="repository-page">
    <h1>Repository</h1>
    <div>
      <p>Manages persisting a List&lt;T&gt;.</p>
    </div>

    <div>
      <h2>Living Example</h2>
      <div class="action-area">
        <div class="left">
          <div>
            <label for="fName">First Name:</label>
            <input v-model="fName" type="text" id="fName">
          </div>
          <div>
            <label for="lName">Last Name:</label>
            <input v-model="lName" type="text" id="lName">
          </div>
          <div>
            <label for="age">Age:</label>
            <input v-model="age" type="text" id="age">
          </div>
        </div>

        <div class="right">
          <div>
            <button v-on:click="addPerson">Add Person to Repository</button>
          </div>
          <div>
            <button v-on:click="saveRepo">Save Repository</button>
          </div>
          <div>
            <button v-on:click="purgeRepo">Purge Repository</button>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Repository Data</h3>
        <table>
          <tr>
            <th>First name</th>
            <th>Last name</th>
            <th>Age name</th>
          </tr>
          <tr v-for="person in peopleRepo.Item">
            <td>{{person.firstName}}</td>
            <td>{{person.lastName}}</td>
            <td>{{person.age}}</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="summary">
      <h2>Summary</h2>
      <p>The above controls let you add items to a generic repository, save changes, and purge the saved data.</p>
      <p>You should notice that navigating away from this page, or even closing your browser does not reset this data (assuming DOM Storage is enabled).</p>

      <div class="code-example">
        <h3>Example code:</h3>
        <code>
          <p class="comment">// Instantiate a repository</p>
          <pre>public peopleRepo = new Repository&lt;Person&gt;(
  new DomStoragePersister("people", "local")
);</pre>
          <p class="comment">// Add something to the repo</p>
          <p>const person = new Person();
            <br>person.firstName = this.fName;
            <br>person.lastName = this.lName;
            <br>person.age = parseInt(this.age);
            <br>
            <br>this.peopleRepo.Add(person);
          </p>

          <p class="comment">// Save the repo</p>
          <p>this.peopleRepo.Save();</p>

          <p class="comment">// Purge the repo</p>
          <p>this.peopleRepo.PurgeData();</p>
        </code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { JsonSerializer, List, Repository } from "tsbase";
import { Person } from "../domain/Person";
import { peopleData } from "../stub-data";
import { DomStoragePersister } from "tsbase";

@Component
export default class RepositoryPage extends Vue {
  public peopleRepo = new Repository<Person>(
    new DomStoragePersister("people", "local")
  );

  public fName = "";
  public lName = "";
  public age = "";

  public addPerson(): void {
    const person = new Person();
    person.firstName = this.fName;
    person.lastName = this.lName;
    person.age = parseInt(this.age);

    this.peopleRepo.Add(person);
  }

  public saveRepo(): void {
    this.peopleRepo.SaveChanges();
  }

  public purgeRepo(): void {
    this.peopleRepo.PurgeData();
  }
}
</script>

<style lang="scss" scoped>
@import "../global-styles.scss";

h1,
h2,
h3 {
  width: 100%;
}

.action-area {
  display: flex;
  justify-content: center;
  text-align: left;
  .left {
    margin-right: 50px;
  }
}

.data-section {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

table {
  th,
  td {
    padding: 10px;
  }
}
</style>

